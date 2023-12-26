const { findLCM } = require('./common');

function countPulses(input) {
  const modules = setupModules(input);

  let high = 0;
  let low = 0;
  for (let n = 0; n < 1e3; n++) {
    const queue = cycle(modules);
    queue.forEach(([_, pulse]) => {
      if (pulse) high++;
      else low++;
    });
  }
  return high * low;
}

function fewestPresses(input) {
  const modules = setupModules(input);

  let finalModules = ['rx'];

  while (finalModules.length === 1) {
    finalModules = Object.keys(modules[finalModules[0]].in);
  }

  const cycleLengths = finalModules.map(name => {
    Object.values(modules).forEach(module => {
      if (module.type === 'out') return;
      module.state = 0;
    });
    let n = 1;
    while (true) {
      const queue = cycle(modules);
      if (queue.findIndex(([prev, pulse]) => prev === name && pulse) >= 0) {
        return n;
      }
      n++;
    }
  });

  return findLCM(...cycleLengths);
}

function cycle(modules) {
  const queue = [['', 0, 'broadcaster']];
  let qIndex = 0;
  while (queue.length > qIndex) {
    const [prev, pulse, next] = queue[qIndex++];
    const receiving = modules[next];
    if (receiving.type === '%') {
      if (!pulse) {
        receiving.state = receiving.state ? 0 : 1;
        receiving.out.forEach(next =>
          queue.push([receiving.name, receiving.state, next])
        );
      }
    } else if (receiving.type === '&') {
      const i = receiving.in[prev];
      const b = 1 << i;
      if (pulse) receiving.state |= b;
      else receiving.state &= receiving.maxState - b;
      const nextPulse = receiving.state === receiving.maxState ? 0 : 1;
      receiving.out.forEach(next =>
        queue.push([receiving.name, nextPulse, next])
      );
    } else if (receiving.type === 'in') {
      receiving.out.forEach(next => queue.push([receiving.name, pulse, next]));
    }
  }
  return queue;
}

function setupModules(input) {
  const modules = Object.fromEntries(
    input.map(row => [row.name, { ...row, in: [] }])
  );
  input.forEach(row => {
    row.out.forEach(name => {
      if (!modules[name]) modules[name] = { name, type: 'out', in: [] };
      modules[name].in.push(row.name);
    });
  });
  Object.values(modules).forEach(row => {
    row.maxState = row.type === '&' ? (1 << row.in.length) - 1 : 1;
    row.in = Object.fromEntries(row.in.map((name, index) => [name, index]));
  });
  return modules;
}

function parse(line) {
  const [left, right] = line.split(' -> ');
  const type = left[0] === '%' || left[0] === '&' ? left[0] : 'in';
  return {
    name: type === 'in' ? left : left.slice(1),
    type,
    state: 0,
    out: right.split(', ')
  };
}

const test = `
%nz -> jm, ms
%xk -> cs, ks
%rh -> ks
%ml -> mf, ks
%mf -> ks, km
&ms -> lq, fm, sz
%bk -> zz, ks
%zf -> dn
%qf -> kf
%zv -> mz, ms
&tc -> mn, xf, jl, xs, zk
%hd -> dn, mm
%nv -> pn, dn
&gc -> zr
&ks -> jn, cs, cm
%vz -> pz, tc
%jl -> ps
%lq -> ms, fm
%fl -> ms
%zz -> ks, vd
%td -> bj, tc
broadcaster -> mn, jn, hd, lq
&dn -> jk, qf, gc, hf, hd, nr, mm
%vd -> ks, ml
%cp -> fl, ms
%jn -> ks, xk
%xg -> tc
%xs -> zk
%kf -> dz, dn
%qx -> ks, rh
%kb -> ms, tl
%mm -> nv
%mn -> tc, xs
%cs -> gb
%jm -> ms, cp
%bj -> tc, xx
%pn -> dn, jk
%fm -> zv
%jk -> nr
%pz -> td, tc
%xx -> tc, xg
%gb -> bk, ks
%dz -> zb, dn
%vl -> jl, tc
&sz -> zr
%gx -> ms, kb
%zb -> dn, zf
%tl -> pp, ms
%pp -> nz, ms
%km -> ks, qx
%ps -> tc, vz
%mz -> ms, gx
&cm -> zr
%hf -> qf
&zr -> rx
&xf -> zr
%nr -> hf
%zk -> vl
`
  .trim()
  .split('\n')
  .map(parse);

console.log(countPulses(test));
console.log(fewestPresses(test));
