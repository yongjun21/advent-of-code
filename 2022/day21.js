const OPERATIONS = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b
}

function resolveRoot (input) {
  const nodes = getNodes(input)
  Object.values(nodes).forEach(node => node.prime())
  Object.values(nodes).forEach(node => node.resolve())
  return nodes.root.value
}

function resolveHumn (input) {
  const nodes = getNodes(input)
  delete nodes.humn.value
  nodes.root.value = 0
  nodes.root.operation = '-'

  Object.values(nodes).forEach(node => node.prime())
  Object.values(nodes).forEach(node => node.resolve())

  const regeneratedNodes = {}
  Object.values(nodes).forEach(node => {
    node.onResolve = []
    if (!node.upstreams) return
    const [a, b] = node.upstreams
    if (nodes[a].resolved && !nodes[b].resolved) {
      const clone = nodes[b].clone()
      regeneratedNodes[clone.key] = clone
      if (node.operation === '+') {
        clone.upstreams = [node.key, a]
        clone.operation = '-'
      } else if (node.operation === '-') {
        clone.upstreams = [a, node.key]
        clone.operation = '-'
      } else if (node.operation === '*') {
        clone.upstreams = [node.key, a]
        clone.operation = '/'
      } else if (node.operation === '/') {
        clone.upstreams = [a, node.key]
        clone.operation = '/'
      }
    }
    if (!nodes[a].resolved && nodes[b].resolved) {
      const clone = nodes[a].clone()
      regeneratedNodes[clone.key] = clone
      if (node.operation === '+') {
        clone.upstreams = [node.key, b]
        clone.operation = '-'
      } else if (node.operation === '-') {
        clone.upstreams = [b, node.key]
        clone.operation = '+'
      } else if (node.operation === '*') {
        clone.upstreams = [node.key, b]
        clone.operation = '/'
      } else if (node.operation === '/') {
        clone.upstreams = [b, node.key]
        clone.operation = '*'
      }
    }
  })
  delete regeneratedNodes.humn.value
  Object.assign(nodes, regeneratedNodes)

  Object.values(nodes).forEach(node => node.prime())
  Object.values(nodes).forEach(node => node.resolve())
  return nodes.humn.value
}

function getNodes (input) {
  const state = {}
  class Node {
    constructor (line) {
      const [lhs, rhs] = line.split(': ')
      this.key = lhs
      this.onResolve = []
      this.resolved = false

      const matched = rhs.match(/^([a-z]{4}) ([+\-*/]) ([a-z]{4})$/)
      if (!matched) {
        this.value = +rhs
      } else {
        this.upstreams = [matched[1], matched[3]]
        this.operation = matched[2]
      }
    }

    prime () {
      if (!this.upstreams) return
      this.upstreams.forEach(key => {
        state[key].onResolve.push(() => this.resolve())
      })
    }

    resolve () {
      if (this.resolved) return
      if (this.value != null) {
        this.onResolve.forEach(fn => fn(this.value))
        this.resolved = true
      } else if (this.upstreams) {
        const upstreamValues = this.upstreams.map(key => state[key].value)
        if (upstreamValues.every(v => v != null)) {
          this.value = OPERATIONS[this.operation](...upstreamValues)
          this.onResolve.forEach(fn => fn(this.value))
          this.resolved = true
        }
      }
    }

    clone () {
      if (this.upstreams) {
        return new Node(`${this.key}: ${this.upstreams[0]} ${this.operation} ${this.upstreams[1]}`)
      } else {
        return new Node(`${this.key}: ${this.value ?? 0}`)
      }
    }
  }
  input.forEach(line => {
    const node = new Node(line)
    state[node.key] = node
  })
  return state
}

const test = `
lvgp: sgfv + gggp
cnrf: gbhh * nsrz
gjcc: jgsj * jvds
gjfs: wjcw + gdfb
sbwg: 3
cdpq: htqc * zzzd
ptpm: 11
dvzr: 5
fbpd: 2
bpqf: ggfj + qhjm
qbvh: 14
gplp: gwnc + wlmt
vhmr: 1
lqcd: ltms * fsdh
dmwj: zlqj / vlml
sslp: 18
ldqz: sftz + mcqw
tmmh: pvgs * pnbq
fscd: rsjl * mfps
tfmh: zslz * cpjd
lrnt: 17
bmfj: 3
bvhf: vpmg * cflt
sqcg: 17
ffbb: 16
ztgp: 3
jdvc: 3
wnrq: 1
gqct: 7
hcnc: 10
mcrm: 1
fpqw: 3
fgjf: nrrh + lczl
jtph: hzgc / tpcq
tmvm: wqnq + snfc
njth: 3
jtqg: jhnn * gqms
pfcj: lsgj * crvw
fnlf: jcpt * fcpv
nfzn: rmwq + mhns
lwqr: jntm * rwjd
rhtj: 5
gwnc: dnst + lvjr
gfmj: wzhn * nvrs
ldff: 5
dwhn: jtsv * prpc
gwng: rwld * twfc
wpcr: gnsd + nqvt
tbdt: 5
tgff: hffj + wphv
dltr: zhsz + lzzc
tcdj: 12
cbgs: 5
nbnr: wwhn * nlmp
jsgw: 5
zjqj: rndg + wtzw
dmls: gfmj / dbbr
trdj: cshn * vdcm
hmst: lbzj + vbvq
dhwb: 9
tntq: 2
bznz: 14
hjsz: 2
cnmf: zjhs * qlsv
jqcj: nmlh + ttdl
jfmw: 2
tztq: jzhf + nccm
jwhh: 3
svlt: zjlw + hchc
rqbm: 13
lltv: tvpw + jccl
wjss: 16
rtbc: vjlj * vfjb
nwwm: 5
rwbw: ljcq + sfwp
dvlr: rbng * gsfh
htln: bssv * rvhb
mfdr: 3
vnhb: 1
ssgj: hwvj + zfwl
sgcm: 4
rbcb: zcgj + nclh
mtnv: 8
dmtn: 2
llwg: 9
trzc: dnbf + ztsc
hhss: 2
trfr: 5
bmvr: 3
ngdb: 2
swnh: dtsr * qhmt
qhmd: lvsl + gjbg
ctrg: vqtr + rcfr
bvct: 3
dpff: nddg * mfrq
drsj: pmqd + lvjc
bdnb: 3
dfdj: 1
lqjf: dmdj + vcwz
chgs: bfrz * qjwc
zjhs: 5
wttc: 2
hzvb: 11
wrlb: glfn + sqws
nzmq: ztgf + gsjd
tgvp: pdgw * jhhf
fvzs: 8
cwgm: jhnm * dvwz
scpp: hbpc * cbzg
hrpc: sdhv * zjsq
fcjj: 1
jnvn: dtng * mtbd
fwlq: 9
hbpc: flnh / wghc
mvtw: mzsg * vpwg
llrt: 2
dnlt: nhdl * hcrq
ffmw: 4
wtzw: ggtw * shgh
mlzc: vrdm * bbdp
tlln: dhjg + dmbv
wrzt: 16
svpj: 3
hdrw: ztng + zwpz
wqqs: ngwj * hrbp
jggt: 5
fggq: rdfw + tbcn
cpjd: fwvc * wgvc
wnnn: pdvw * sfdc
zslz: grnq + vngn
mzhg: jswn + mvsv
fcvv: 5
pfgm: 6
dcrv: 18
hvzv: ftlc * zjfq
wrnc: gwrr * hwph
glhf: tgvq * qztl
dqnw: 3
rcdt: cdmt * grlh
tvww: 1
bqcp: 2
fpqj: 5
rnbc: qzfn * wjhp
psgb: tcdj - gdfw
wwbp: jbdg * bctv
qftw: 3
ffzr: 3
lbgl: nrqw + wsjm
vbmq: bjhn + mvhw
qlmr: tsss - bldw
nffq: mwmz * sjcv
mfht: 6
zjfd: 1
nrqw: tqht / dmvr
bjcj: sncs / mmtb
slmd: fncp * vwmf
bpwn: plhq * sgtc
nwdl: 2
mmrv: lsjz * bdnh
sfjd: bzbl + cfqb
jzwh: 2
tgsc: rcqt * bjdm
qndg: 3
ldpl: 3
jhnn: dntn + mcrm
gbgt: 3
wjgw: bdwn * tnbj
trtp: 7
sbts: nbgt * gmrp
clnt: 2
qgvv: 1
qgbw: 3
bvhc: 4
vzcv: pwlh + glzv
sqjp: 3
wlnz: gpml * vmgd
ngvp: 10
bqfr: nsth * gcvs
jjsh: rbmj + tsgd
nzgr: tbwn + pbhd
cvtd: 2
cbqc: 3
qvvg: 3
gnml: 3
jgfv: 3
ggfj: dszz * vwdr
rbtj: 13
dbwm: 15
ffqg: mjjv / fqvp
qhjm: qhtj / qjhj
sldc: djwb + cnjb
rwfs: qzqd * jqjn
zcnc: 5
dlww: tvmj * twmv
dbtv: 2
fgvh: 2
tstf: 13
bbwf: 4
nbrp: hpsb + hfhg
prcc: rzsp + rqbm
gnpp: zwwt * djgl
zhsz: glhf + mlcz
zpgq: fmfh - zbdl
pjvv: vnpg * dglb
hpsb: 7
jfnz: 3
qzwt: shlf - tjgf
qqhd: 2
drfv: cmlc / prcs
rlfc: swqf * trwl
zqng: ghvv * zrgl
vbws: drcd * bnvj
jsff: wnts * mtbw
jzhf: tfwq / pzmq
cnhn: jqrv / hhsl
gsjd: 6
ltjj: mvcp * zdvc
zwqg: 4
zsqw: 19
dnzj: qrdt * mhrw
gjgd: 2
rgph: lbgl + scsv
dtsr: 2
hcfz: gscb - dvzr
nbsm: cgjq * dqsz
thbp: 5
nfjb: hpbs * pbhr
zfvq: 4
hrbw: wtzv + ntbv
phjc: hqnm * fjmh
zqrv: bvgp * brpg
jnld: jlmt * gjwb
btqt: bssg + gtbv
jnvj: gltm + dhbn
mjqb: 2
jpvm: zbgz + ssgj
qjwc: qmrc + gptz
ldhg: bcvr * zgml
pfpp: 3
mvqz: cjvt + rbcb
rbsd: 4
czsm: hqhg + bzjl
swrm: dbgq * rpbs
rjtf: 6
vnmp: 2
spnv: 3
phpv: dnqs + tjtf
vgsh: tddw + psgb
svtw: 2
plzn: cwvt * ctss
mvwv: 2
qzqn: bsns + frhg
hvdm: 5
wtpg: vnmp * psff
fhjz: 3
ndtq: 19
jbll: bmrb + rjcs
sdzt: rjrg + rwfs
swqf: fqsl + lhms
lttt: 4
qbjs: gdvd * sfnq
dnst: mbjm * mqgz
jgjf: 15
jhtt: 2
vtrg: whwg * wmcc
rwld: flnz * sdsh
ngzj: tgnb * nsdd
hwph: 2
rcmf: lvgp * dmtn
dwcc: 1
wznj: zsqw + whps
gzbq: hbtd + hwqn
cjvm: ddng + rqjt
qspd: 16
nldf: pfbl + qdgt
nclh: 2
nwqn: 2
rcjp: vbsq * vrjh
sdnp: crqm + fjpw
ggtw: ptgl * smnb
lvcv: fljr + cmcf
pvzm: gbwt - sfrh
hhft: cpfh * gmhs
nwhs: 3
bvjq: 5
qztl: 5
hvnh: dmnr / glrs
rwjp: jwzg * pjbr
zfrs: 2
wbgj: 11
bfsp: mvfd / hwjv
zchz: 11
qjjd: 3
ttjc: 3
nqpm: 3
zzsc: 17
zftl: 10
tmdg: 11
lbzj: jnfh - pplj
mznl: 3
fvbf: 5
qhzd: 2
gwnw: szmq + cdmf
spps: wcmr * lhjb
wldf: 3
jcdc: 2
mtbn: vfbl + hqsc
bmdb: 3
vzjj: 8
mjzl: 18
whhz: tvvc * hhzb
dmdz: mdfl / sjwz
bvfb: 1
sddg: 2
gscb: vdtf * mjrp
wscg: 2
lhlb: dsgq * bsjd
vdtg: wsrg + lwqr
sjwz: 2
hhlp: 1
fmmf: 4
prpc: 2
whfj: 3
tbzw: 14
fhwm: bbzz + hfds
zgzm: 8
mmtb: 2
wsjm: qvdj * twfr
cqzg: sfjd * cqfv
rccv: ndtq * rllv
zttm: rswl - mllf
lzpv: 5
mvhw: pllp * jpjg
lcvl: rcdq + mjwg
rcdq: lmdn + hpnf
pphg: wrlb * wnrg
zqdt: qpnb + fgjf
zwvm: 10
tdjq: bjcq * clnt
tpmb: mmrj * lzpv
mcqw: mmgf - bpwn
npgh: mjfm + ztnm
gqms: 4
mbnd: sghb + gmtm
pmpc: 16
vpwc: jnqw + hqpr
tcvz: 19
mpbd: fwwf * fgpt
zbgz: pjwg + nwdd
cvws: 9
grlh: tdrv * qnqm
gqmf: bsbm + lhrf
bsns: frtw * hphm
jnnf: 17
vrmf: 4
plmr: 2
pwlh: 12
tnbj: lbjs + vnfm
mbjj: 2
gsfh: hnlg + cccd
fcqh: bvjq + snrs
gtlb: znsd * swpw
pzmv: hhcf * jrlq
vhng: smsv / tzms
bwcz: 5
vnbt: 2
vmdd: 3
crqm: qcvg * rgzz
lvjr: tzzq * tzgh
zsrv: qqrc * jrps
vfpj: 2
cdwl: frvm + mspp
bwrt: wwdz * fgbc
htlg: gczg * qcbt
nlsh: ntff + wgcc
tcjz: mbnh + msgs
hscp: dsmz + rzjm
trlp: 5
vqtr: qspd + zqdn
ctss: 11
lvsl: tnln * zqsq
pvhb: nlpl * hhss
fhnd: 2
pctv: 16
gwhj: hcld + cnjd
rcfr: znrr - hfvm
wgvc: wfnz + rzpd
mscw: zvwq + pfgv
bjvn: jmzv + shtd
ztff: 3
qhtj: vhpn - sjbl
rhzv: 7
nwpr: 2
pzmf: pvpm + tnbg
nqvt: 5
smnb: 3
wgtn: 16
prgt: 2
vqdt: 4
qhcz: 4
tqsj: hjsz * rhms
wsqc: 14
sgtb: 13
mctb: 3
zzrg: 3
rddv: tfjh + fwts
nwfb: 3
tnbg: fwlq + whpp
qrjp: jmsr + plmw
jrqd: 4
smtb: jnmv + zqwv
jlwf: flqj * mnwz
fsgs: zgfq / sddg
hnpw: 2
vblp: gvmm * ggrl
jlmt: 2
vhwq: 3
wdvg: gcnz * hpql
rrdt: ghpp + jlqs
tjmm: 14
gdfb: 5
wbgd: dltr - wdsg
nmcr: twjs / mfft
bmdh: vnsm * zwlr
npps: 5
vpwg: 2
trwl: 5
vllb: 3
nlqc: 2
jswn: jlch - jpfv
rzfd: 4
gbdq: 13
vsww: 4
jcml: wvzc * jtgg
jnqw: 6
hfds: 17
chgl: bmzl * rrvj
cmgb: mfrj + zqsj
rddq: vjmm - mcmw
npfq: 12
fbwp: cdfv + hpbt
hpdd: rwjq + vwff
lzcj: 11
dnsq: 4
ssrl: zzsj + dwhn
bzph: 1
rfld: ncmf + vcqp
svtj: 2
stnb: tnph + mqlw
gwdd: qqhd + gzvn
pqqp: jgjf + cwgm
gfbc: 2
wfgb: gjgd * pjvz
ztpp: 2
bsld: dqnw * hrzn
gsws: bljj + rqwm
tjvp: tpwc + cdhc
fncp: 3
fhbz: wrzt * jzsp
tgvl: mgnh * rghd
zvqc: 7
whwg: 2
ntvn: zjhc - wqpd
pfqh: 3
lhtn: 5
jffc: 2
flqd: 4
gcnz: cdtw + vbws
qdzs: 2
flrf: 9
vfjb: 3
trsd: 7
gfhh: 7
qzfn: 3
bfmv: 13
lnlp: 2
gbpf: 4
dmdj: 1
tmjg: 4
nmnb: 3
mgnp: 5
qrbl: 2
sgwt: fzlj * prgt
rhnq: djfm / nctg
mqqh: rrjw + ffmw
nvhm: 10
mljw: bsln + ztqr
tcbj: 3
tzms: 2
jdsr: tmcv - jzzr
lhzw: 8
jfrn: 2
nmcm: 2
rwmg: phvc / zrrn
jljm: jmpm + mtdv
wdht: ttrc / jrjp
bsnj: mmdn + wlsj
hdjq: 2
ddpz: 4
swmv: nzrg * ctrt
ppdc: pvnl - qgvh
phgs: 13
fntn: 2
ndqp: hqfd / tmjg
jjlm: 5
svmj: 2
sgfv: nstd * gjtn
sgvp: pqqp * jjsh
tthz: lstc + wbww
ncvb: qffn * mmgs
mjrp: 6
cjtv: jtmp + bztj
wzwg: 2
pgtr: dzgh / ztdf
mdwj: jthl * zsbf
mssh: lltv * dmdz
cmdv: 7
sfps: vvbn * pvmr
wzfd: njvm * njls
vqwj: 3
qrvv: 2
fnbt: jvzf * mmqb
rmjn: 15
mdzd: qhgf * vqff
vdnf: nmcm * zrvm
wwds: 5
ncdg: tsnm * vbmq
zdcf: jsdd * njjd
btbc: 2
nrrh: 9
hcrq: 5
vwjh: fjgg * pgjn
vhpn: qwnj * tmmh
cfcv: brcp + zgzv
lnqm: 2
ntpb: 2
lsnl: rwhf + zrdj
bpbq: 3
dczc: 2
gvhl: 3
jgbv: 1
tsvh: 17
tpmz: trqj * pvbm
frhs: 2
hfbm: 2
bfgh: cfpd * nqbb
bbss: qppf * fpqw
npdl: wwhd * gdng
mfwp: rqvs * vrcr
dlpq: 1
svdh: 1
whps: ggtm + mclc
fzcm: 2
pvnl: grlr + dfrl
lcbg: zftt * zwqg
qwnf: qqlp * jzwh
rmzd: dcpj * pvzn
pbnt: 2
pjvz: nlsn * zhhw
ggdf: pqlq * rsrg
ltms: gjcc * blnl
tmlq: gfvd + rcrn
wcqp: 1
nddg: 19
jvzf: dqsg - cgzf
chtv: hpbd + jsff
cmsm: 10
mspp: fpqj * crll
qctt: csrq + trbc
cncb: 2
njcc: ztcj * rtls
pbmj: gzfz / llfc
gjnw: 3
fhzq: 2
hjph: 5
bctv: zpdz * cvtd
frhg: fqrt * bssd
tvmj: 3
dbsv: 2
hghm: 6
zzzd: 13
zgml: 3
ftgz: wzwh + vhvj
fpjz: 3
blpt: bmtp + cjhm
jcpt: drsj - gdfl
wlgb: 2
drgv: 9
ncwh: 5
vwmf: vhwq + sbts
cshn: wgzz + wtpg
vrlj: qfld + gbwr
gnsd: 2
cnjb: bfcd * mnqr
wvlj: 2
zgnc: vvcb + zbtv
vdtr: 2
fjgs: tztg * sftg
hmfz: 2
fptm: 13
wphv: 11
dfzf: wvbl * cmvs
ptns: pgwq * rqjv
cdbh: fdll + jdqm
vwds: 3
tplq: 3
wcpm: lflw + gfws
rwhf: czsm * mmqp
rjcs: 15
wvvn: whfv + ltgm
bvvm: 5
lngb: 3
qvdj: 3
qzqd: 4
ndrv: ggjg - trsw
rvvp: 4
pcch: sztw + fcwc
ggqc: 5
rggz: vljb * hpdd
pthq: 3
dnqs: 2
jnbm: pqmv / znvw
lhjg: pctv + jbdp
mjjv: cpgp + sslp
gjwb: 10
brms: rnvg + slpn
lnzd: 5
ghvv: bfcz + zflz
ngpn: 2
jlch: glsm * gvmt
rghd: 7
cjhm: 7
bqnr: prcc + mstp
ztqf: zfwz + mbpn
cpnm: 19
jhqc: zmfg - qzrc
rqjt: rhww * mbzz
rmnj: 4
vdtf: 3
npqp: fsdl + wlpd
pdvg: 3
rhzl: 6
jzsp: 2
bfcz: 4
trsz: spzz + fhjz
qqsm: 2
jllb: dlnm - mdtd
hnfm: 2
zdjq: vgvn + mpwp
sqhg: 3
hbtd: pjsw * dfsw
lvhr: 2
jthd: 8
bdcd: mcnd - hwpj
jwrd: jwzt + nlqg
wsrg: lwwv + lbwn
bbtl: 4
zvmh: 19
bfcd: 3
zmfg: dmbs + njcc
ldlm: flqd * vgsh
cblz: 14
svfq: 1
mvms: 5
qprn: vdtr * ngdp
pfjq: 4
hhsl: 3
cgsb: 7
ntff: pgwv / wcpc
wbmb: 2
vffn: lnqn * lvhr
grht: wgtn * btch
bqbs: 17
tgzs: 3
pnlj: 9
wvbl: swmv + hcnc
tmrn: gqct * nmgl
nthq: 6
lndn: bqjf * rvrn
btch: 12
jgtl: zbsn + dzrr
ndls: 18
mbpn: 4
tgqj: 10
qqlp: shmm + qnvh
mjdf: lnjh * pwbc
lwlf: qvvg * gjnw
fqwg: 13
gptz: ttjc * bqvc
bvsm: bcgs * wthz
bcvr: 3
rqwm: bdnb * nqpm
zstd: slmd * pthq
rflr: 5
rmpb: 13
dbpr: djzj * dsmt
tsld: mznl * dhwb
bbwb: 2
gdfw: 1
ltvh: 8
dpsq: mflq * szwg
qvdh: nrlm + lpwz
rjrg: jdsr * jzws
qrmq: fbwp * pphg
mwmz: 5
tplz: 5
zjfq: ncdg + jhzh
nwdd: wdvg * hnpw
vcqp: rlfc + cbqb
mzsg: 4
lsvq: cnrl * mbls
htpl: 4
nqcm: 2
mqcc: 2
cmqj: 13
wgjh: 4
thll: 4
vgzh: 3
mbzz: shhg * trsz
flqj: 2
fgpt: 5
tmws: jsgw + wlfz
hwpf: vrqr + lmfs
jvhd: 3
qlrp: 3
szls: 3
wjsc: 5
dbbr: 2
vzzf: zvbq + cwmg
zflz: 3
cbdq: 2
dglb: 5
dsgq: pdvg + fdwb
jpgl: rplw * qsnh
sdhv: 2
bbdd: 1
pfbl: mpmw * zqdt
qmjj: 4
hcft: 2
jtgg: mdzd - bfln
hpgl: 2
jzhv: bcvv / gbpf
zjwd: 2
tjgf: 4
tlhs: hcfz * dggq
shfq: trlp + tfmn
vvdh: 2
wcmr: bvms + sqqm
vqrl: 1
bvrq: 8
nlfj: cbsw + wbvs
msqc: 2
vdvd: fmgl - vscb
nmgl: 7
ggpd: 3
rfcw: 7
bfsn: 1
chhn: 7
hpql: 2
rrvj: vhng - lsvq
sfnq: 4
hstz: 3
jflz: wgln * wfvj
hfvm: lqjf * plst
clgr: dwsf * cftg
jvrf: 5
fsdh: qrvb + fwzm
tqnw: rtqf + ggmn
lgcc: 13
bprr: qnst * przr
dsmt: 3
hplh: 1
ggtm: 9
sfwp: wmmr + tlhs
sbwl: bgpg + zjjz
fzdv: nwpr * lwss
qmrc: vjqw / tjsh
mfps: qclt * rtvh
zdvc: dgvf + wlnz
whmz: lvqf + srvc
qbwh: tbcp * mvwv
tvtn: llfs * sfps
wzwh: 5
cqwj: 6
hbct: jlmj - mjzl
mflq: 2
vmdv: htnw + msts
dndl: 3
fllb: qctb * lnlp
wzmr: rfcw * dfrn
wrmw: jsfm - btsb
przr: wcvt + pcbb
lbjs: tvhz * jgtp
wfnz: 4
vcwz: 6
tzzq: 2
gddf: mwld * gcrf
lpwp: vgzm * wfcp
wtrl: 4
pbsr: rsjz * bvsm
qwnj: rccv + humn
gbzf: gnzg * tptb
dcvr: mjsp * zhrv
ztnm: 16
nmjh: lgcc * vwpz
rhms: 19
dsbz: jtqg + tthg
vqff: mctb * swnh
gmhs: 7
rtmn: tgvl + ctcv
btbq: 6
nvht: 2
gjnj: 16
rpfq: jnvj + tzlc
pjns: 6
lccf: 2
rwbd: cczl + wfvn
mfrj: bncm + plpd
zdqh: fcqh + mchl
sdps: hcnl - rcmf
rssw: 16
fwzm: pmrt * jgqv
wfcp: mrdp + hspq
tsnm: jhgv * lrbj
cwzp: ldnp * qwcm
fpln: 4
gjww: 4
ggsl: hghm + zjfd
pswd: qbpp / fqhm
vcfs: gdrn - hpgl
wmmr: 4
bljj: 2
rgzz: 17
gsnn: glvv + mscw
pdqw: 8
pqgw: 3
zjjz: pbmj * bbmj
dgvf: 1
cwpw: 4
rlbh: 11
qgnp: 5
nbwp: 1
tzhj: 6
dfrn: llsb + dptn
ldjl: dlfd + jllb
tsmn: nqgg + zmfl
qfcc: 8
vpgc: 2
bwzb: 2
qrdv: 2
ddzv: 2
zctt: mmdd + fggq
mcmw: grdz * npgh
vvcb: zdzd + nthq
lbwn: bwmd + gdfs
pgnf: jlnl * tbrr
hctp: 3
jqpm: 4
cpfh: fcjj + tpmb
vtvc: 2
zhhw: 2
bjbh: dczc * sbwl
swdd: 3
psmn: 10
twjn: shfq + wgdj
gfqb: wcnm - pwgf
zphw: cdpq + spsw
smct: fltq * mjdf
vpmg: 2
wdsg: vwds + dqgj
cmrs: sgwt / bbwb
jmbh: 5
hwnd: nchz + qnjj
zgzv: 4
ctvp: 5
vljb: 2
scdc: pfqh * bwln
mgmp: dzmr / twlq
slrh: vnhb + hzcz
lnqn: jhcf + llpt
ghwf: twmq / wsjs
qflr: zrgz / dbsv
hcff: wqww * pwsw
pbhr: 2
dvvv: 2
nmlh: wlgb * dfzf
fwdv: cvws * svtj
qfvt: dtmc * bhvt
zctr: 6
wmjq: 5
cwtg: 9
swsl: 5
zgjh: tsjz + sddr
qphm: 2
jfds: znmw / plmr
dpcb: dgtr * dfst
hszl: lgtg + qnbq
rdqt: bmms * wsmr
dpnh: 2
htvh: 8
grzf: zgzm + dfhq
drgn: 3
mgcc: 5
vtmg: vllb * nsft
czwl: mlph + cpnm
gqvl: 2
dsdl: ghsm * tcbj
lstc: 1
ncrp: 2
wqnq: 5
jdwn: 12
mvcd: zbjv * qzwt
fpfl: 10
czfg: 2
dntn: 6
zrct: 4
tccn: phgh / jzdf
mjlz: svnl * qndg
dhjg: ttdb * ztff
pgwq: 12
mmdd: zvpg * qrvt
hvpm: 2
phlb: fbvr * hsmd
cmcf: qsjv * gdht
fsvw: stzg + bjvn
gczg: svpj * qmjj
wqcb: 3
sprd: zjqj * jggt
nsfd: 2
mfjl: crdn + pzcj
htnw: vwjh + jjlc
zvwq: hrvb + lndn
bjhn: wlhs * bvhn
jvds: 7
ctrt: 3
rptq: qbvj + wpnm
wwct: wrwn * nrwz
zmpd: lttt + bpdd
jbdp: cdwl * whbs
tzlz: jggr * jtbs
cths: pfpp * hjfl
jgdl: 2
gdfl: 2
flwb: zdcf + mbsg
bdzv: 5
bcvv: rddq + gzbq
tlff: bhqn + bqps
vcmq: 14
jmzq: tcmj * wbtp
zwnt: vttt + pmpc
sqws: 6
sjfz: 2
ffbl: nvqg + bdqd
bhqn: fhsj / gfbq
qfld: 15
zctg: 15
cchs: 2
jdzw: hjph + dcft
tmcv: nbhw * zmqg
jvtm: jfwb * plfg
wzqv: 2
nnfj: lsnl / zctr
qcbt: 2
wwcb: gjwv + grzf
cwmg: gqmm * dpnh
htrz: btfl * fgvh
plmw: nnfj + jnbm
wjfl: hnnc + clmj
nqpc: 5
lftd: 2
ffwp: 3
sftg: 2
lcqs: tcvz * mhzr
jmsr: fdjb + ftgz
nzsf: gwpq * nmhj
nvzd: 19
wcbv: nvzd * zjbs
tftg: rzmg * bfmv
zmmt: 2
drbp: 2
bssd: 2
jwwv: nmcr * pswd
nwvm: 3
pcwm: cmrs + nffq
rcdm: htlg / fwtm
dnzb: mdsg * gfbc
gdfs: jmrb + jlwf
cwvt: 2
rgft: fwvn * mpcw
jzzr: nzfc + tplc
rhjb: gwnw * vqjc
nlqg: 1
pwsw: 3
hhcf: qmrg + rwmg
mpqg: 2
zjdr: phjc + rqsr
vsgv: 5
dmsc: ldml + mdwj
nmzt: chhn * zjrn
wghc: 4
bnht: mhlq * hdqv
fmfh: gwsj * jwhz
ztdf: 2
gmfb: 2
ggmn: 5
cbzg: 4
tfmn: zwnt + smct
mbvp: 5
nfdp: dwcp + hrcf
jfjr: tftg * swdd
cbtp: jcdc * zpgq
ztgz: pdpq * qqns
fjjm: 11
zwjz: wgcm + tmqn
stzg: nqpc * bznz
tcqs: 2
wcvt: 3
rbgb: 12
ghrs: gnpz + zvmh
jmrb: 4
phns: 2
hqmq: grht / ztqf
zclh: dhvc * dtcz
jlmj: qlgj * bwbf
hpbs: 9
lwwj: 6
dvjp: wldf * tpmz
bfln: lhrb * tthz
trlt: 5
mlcz: qmvn + stnb
swbv: 11
nqgg: mlhv * jqtn
zjlw: 4
jpww: jrzl + tfmh
crdn: 3
brqj: 6
lsmj: bngz + cjhz
bvhn: zsds * fzcm
bpqv: dqbl + gdcz
mrdp: wznj - jljm
mvcp: 2
wvcp: 11
qmrg: bbdd + tjpd
lvdh: pbsr + wwnv
mcsq: gjww + pnlj
hwbf: 4
cchl: 8
pcbb: 20
hwpm: 4
sfqp: 3
qscv: nwhs * mlzc
wvbv: 4
gzfz: mqpc + bcld
crlj: 4
fbcn: 4
ddsb: lnqm + bwcz
ssqv: pcwm * gfhh
pfrz: 2
zdrm: 2
wqwb: bhjr * bzhv
zjtj: 3
mzln: 4
qswj: tzhj * jwrd
fjbm: 3
tdzt: 3
vrsv: pfvd - sdrc
jfct: sfvq / bmdb
dqwq: rhjb / bbtl
jwzt: mvtw * nlqc
zftt: 10
wzhn: 2
mzqw: 9
dfgf: 3
mstp: nwwm * ztpp
glrs: 2
jrff: 6
nlzz: rcjp / mffj
dfpg: 5
bjcg: nbcn * wcpm
zgpc: zdrm + glcp
tjpd: pqcq * sbdz
ggjg: pfrz * cwpw
rszb: rtlh + rdqt
hmlc: cbdq * tthv
zqsq: 4
slbr: jgdt * rnwh
shmm: 1
smvt: mqzt + cnhn
gbbq: ncwh + drbp
nvqg: 4
llfs: 11
lwss: pgnf - dmls
bhvt: ftmd + hwfc
hrbp: 3
pmrt: bhst + rqww
cczl: vrlj + mljw
dptn: 3
qccm: 5
wsvt: cwtn - cjvm
pqlq: ttwc * cbzw
zhfw: 2
vvbn: 3
glns: mzhg / qqsb
jrjp: 4
twfr: trlt * mvqg
dfsw: lcnl + tndc
shhg: 2
mdbb: wrmw + vgdb
vwjt: 4
bbzz: psmn * tdzt
vbzm: 2
ftgj: 5
cldt: clgr * nqcm
lhjp: 3
tsgd: 2
rlpc: 2
fqnj: 3
lhjb: 9
plhq: 3
gcvs: 2
plst: 3
dgbq: gnpp / jmbh
gsrm: 3
zwwt: 15
zbsn: jnrw * drjn
zbdl: 4
cvgw: 3
cbth: dfbb + cnmf
jqlv: 4
ntgp: fprr * zjzg
bcwp: zctt * vqdt
vqjc: 4
zrgl: 3
mjbd: 5
mbwp: 3
cdnn: wnnn + rnls
srvn: 11
ldnp: 20
rhcm: dbww - ddzt
qwcm: 5
pprf: njqv + qfvt
flwf: 5
nrwz: 5
jmzv: hmjd * qhsm
hwvj: hctp * whmz
wgzz: tgvw + hftb
sbdz: fcmm + htpl
bbmj: 2
wrwn: 5
rllf: 3
qhgf: 10
llcs: 4
bssv: dtzr * rfpp
mhzr: 17
qsvs: lpwp + vdtg
bpcd: zdqh + hdcq
djwb: cchs * jtgw
mbjm: 9
lvfw: rqwj * rcnf
zwdh: hldg * vbzm
lgzl: pdzf * fptm
qmvn: brqj + dglt
rzmg: 13
qvfd: 5
tbwn: rjtf + sbwg
mpqd: rfhg - vdwz
dggq: jfpp * gbfr
mmgs: 5
qpqz: 3
mfrq: 2
gzhf: 3
csrq: 2
hwpj: cqzg * ldtm
hdcq: nbrp + dbpr
njjd: chgs + jhlh
lvsb: vffn + svfq
snrs: jfrn * vvcj
llfc: 8
gnpz: 2
dqgj: 4
wvsf: hhws + fmrn
cmjq: sgcq * jvrf
jfpc: 2
cmbl: qdhf - mgcc
tddh: lrcd + ctvp
dcwz: dcvr + bdfn
ttdm: zfvq * tjmm
qgcr: 3
rgpr: 5
fwvc: fntn * sqhg
dcpr: qzfc * cqfj
ldtm: qwnf + tqnw
lswc: 6
mjwg: qgbw * jtsm
mgff: 2
sncs: rhzl * fwdv
gwpq: qlvq + qngj
mrfh: mwlv + rnbc
dqfv: 2
rswl: 16
qbjq: 11
clvr: lgml * ftvr
dvch: wwct * bqbs
frtw: 11
qjbh: 2
cplv: cmgb + zmmt
ssdw: 4
hzcz: hdhh - pvvz
ldml: 3
lrfd: dvlr + ppwf
tjrb: 4
ghsm: 3
zhvv: 4
cbsw: jcnl * cfrw
jfvq: 2
mggf: 3
tprr: 4
pfvd: fsvw * mlpc
dqsg: jlrd * tgpl
cbrp: shbs * lrfd
nwrc: 2
rqvs: 7
ttzl: 2
djzj: thnv + cltl
wqsz: 3
znvw: 2
gcrf: 4
lchl: 4
qdwb: 3
jnhv: 4
bcgs: 2
rnwh: 7
lltb: rdlj * mctq
jtsv: 19
dlnm: tcjz * rcdm
jgnn: djqz + dtrf
fvzt: 6
pvzn: 2
hvzm: rlsg + cjtv
jhhf: 8
sdjv: 4
bgpg: tjbh * dmht
ggvp: tgvp + gpdp
nwcf: mtnp + dvvv
hzgc: zdjq * nrjz
pgwl: qzzl * fjjm
pgwv: llrt * flwb
mcnd: zfrs * nbzs
fsjm: fmpb + mcpq
bfrz: 2
lvdg: wfgd * sllh
cbqb: 4
fwvn: 2
fwwf: 10
wvzc: 6
ztng: ddsb * ntvn
qfqw: 7
lbhc: 17
pqmv: rzfd * tlff
qvbc: gcfv + mpbd
fdjb: cblz * dwpr
sffj: 3
mqgz: 5
plfg: 2
zbtv: 12
vznr: 4
zjbs: 2
gbfr: 4
tmqn: ljzq + qhmd
bdsp: 5
jhnp: 3
lsnn: 2
dqsz: rdcz - zqhc
dgtf: 2
plpd: jrrt * qcgv
zrrn: 2
vtzh: qmcn * tvnn
lrbj: 2
glsm: vdcc + sdnp
fvbj: bwrt * gjzd
fppl: 9
vlgd: 6
bztj: wdll - wljp
vnsm: ztdg / fslg
tstz: fhzq + tvpt
hjfw: vdnf * nvht
hgrc: mbwp + rwjp
gtbv: btbq + tddh
mpln: 3
dwcp: 2
dfmg: spnv * sfhr
cfqj: hqmq * nwnh
rzsp: 8
vrcr: 5
crsr: 9
ghvr: 2
fhlv: dnzb + snrq
qcgv: 2
rcwr: btbc * gsws
rpmc: 2
tfwq: gngv - gqmf
jhlh: mfjl * gsrm
nlpl: 19
fcfg: dcwz * bccc
cbdh: cncb + nggb
pfgv: 17
rdcz: qscv - jsbf
ltht: 2
fbvq: 3
fwtm: 2
fprr: 4
pbhd: 2
lgct: chrg * gzhf
lbfj: 7
jrps: 5
dglt: cchl - tvww
rprc: 5
zzrj: qfjz * glbm
bvgp: jqcj + bswg
rpdb: 3
cltl: hcff - nwfb
mbnh: hzsz - mgmp
tndc: 3
cmlc: pzhn * cdzz
humn: 1940
cnvz: 2
pwgf: 1
wvzf: vbvf + gjnj
gpml: fbpd * cpnz
fqrt: rrnr * nbjv
pcwt: 3
jntm: 5
mbls: rgpr * jqlz
qvvz: 3
fgcz: 5
wwdz: 2
hqnm: 3
wgln: 3
ngpw: 3
gmtm: 1
lpwz: flwf * qjjd
nwnh: cdjs * hwbf
wqcl: pcmt + jzzq
dmbv: zhlw * ncrp
dgtr: 5
wlsj: 14
qdsp: 9
nfwz: 7
wjwl: ctrg + hhdt
flnz: 2
mqpc: rpfq * npqp
mdtd: bcwp + bldp
mdtq: chgl - nfzn
bcdp: bvrq + ndrv
bpdd: wcbv * fpgb
chrg: pcwt + rcgq
glbm: 2
lrbg: bqnr * ctwm
rnls: vncp + jqpm
mfft: 2
gpdp: 15
cnpf: gbsb * jtph
wlhs: 2
ffjf: nlsh * scdc
nlmp: czzp + pcqb
tshc: nhdh * vdds
hrdq: nzct * smvt
mvsv: lhlb * tgff
qwrv: 2
hpbt: 6
pjwg: lzcj * dplr
slqj: 3
vlml: 3
drjn: sgvp - rltm
ppwf: mmrv * qgbm
ztzs: 3
dfst: 11
spzz: 4
wqwm: tstf * chlm
vgdb: jzbl + bflw
jrlq: 16
jpfv: hzrw * cnpf
drwq: tzlz + zjdv
wcpc: 2
nsdd: bhtd * dhhl
ftjq: 3
qlqm: 2
dhzv: 2
rdpn: mpqg * jqlv
qhmt: 4
sfhl: nldf - nzmq
rwbv: 4
vngn: jnww * wwhp
zqwv: dmwj * lwwj
hmjj: 3
fcph: ntgp * wjjs
lvqf: 8
czzp: gbdq * twpz
pvtc: lftd * hwnd
pdgw: 4
wpnm: 3
rpbs: 2
wpwv: zlbn + tjrb
cgdf: djlz + hdqj
wcdl: ctdc + jmql
mqlw: 8
hghb: wttc * nvgd
swpw: bbss + chzv
cpnz: 8
trqj: 3
gcfv: tplq * hpzp
bdwn: dcrv - prgq
vfbl: bprr + lgct
dmbs: 1
gmrp: 4
qcvg: 5
gdpq: 4
hzrw: 2
sdrc: tqsj + dfmg
cbsh: 5
zbjv: 2
gfbq: 3
gvpv: cwtg + mjqb
pllp: 3
rvrn: 9
jqqb: 3
gjbg: 7
bldp: bncg * rpdb
ngts: 6
zgfq: tsvh * zzrj
mngc: 8
srsn: rgcc + zgnc
ddtb: 5
hdqv: jdzw / gmfb
tjgr: 3
dplr: 11
vrdm: pdgj * lhfl
mvvw: trzc * cfcv
ntbv: 6
ngws: hzsb * zjdr
sghb: ftff * zvfj
vbfg: 1
qmhs: mjbd * qvfd
fvts: 3
gssw: 19
hwzd: chnn * bghn
gnzg: rtbc + lcbg
qrvt: 10
sddr: 4
jgsj: wczp * hdhd
tthv: 16
mmjg: 2
fdbz: 5
fpmm: flbs - bbqm
lhrf: bmdh * gqsv
cjns: fvbj + lzlc
lgnv: hmvd + tvtn
jrrt: 3
tcbf: 4
hgbl: 3
bmrb: 14
nmsw: sdjv * ztjj
gztb: hrpj / wflp
pdgj: 2
qgbm: 3
rrnr: 2
dvwz: 2
wdll: srqt - ldff
gvmm: 13
qffn: 11
lrtf: hvzv / vlgd
qjhj: 2
szhw: wvsf + qhcz
zrlm: 3
fzsn: 13
vtgs: 14
fzpr: ldqz * thbp
dpgv: 5
sjcv: 3
grdz: 3
qgvh: 4
qctb: cvnm + mvcd
vjrf: mfwp + mhsb
gvnf: tsld / drgn
gwrr: 20
jbdg: wfpw * hffd
whfv: pcwg * fdtt
jwdd: 3
qtmc: jfct + ngzj
rlsg: dchq * tggw
wtms: swfb * qctt
tpcq: 2
ncrw: 5
pwbc: 2
pcbf: cbqc * rjbs
bcld: vfpj * lcnr
rffw: dtft + glns
bngz: nwdl * ggqc
ngdp: hrqh - nrgn
cbzw: 2
gfws: dpgv + jgnn
dlfd: mssh + nmzt
zgwt: cldt + jmqc
tstj: 2
mwhc: 3
jhcf: 7
srqt: mqcc * mqqh
bstm: vwjt * qhzd
gbsb: 5
hsmd: vtnb * wwds
hhfn: 2
cgcr: 2
wnnw: pgfh * qrfb
wwhp: 11
tgnb: qccm * jnhv
jnww: tprr + hgbl
dtft: lvdh * gvgp
zrdj: tdjq - jbjr
frhz: rgqz * rmjn
szwg: 6
zgjs: 5
phgh: slqj * wqwm
wjjs: 3
btlw: 2
vhvt: 19
djlr: sprd + tqnr
mjsp: jgdl + swbv
nmcz: ptpm + vzzf
rvhb: bfgh + fzsn
tdgr: fvfw + jfnz
mtnp: 9
jjsp: njml + fvzs
bdnh: rfps + pghl
rtvh: 3
chzv: ngvp * ftgj
bqjf: 2
nrjz: 2
pdzf: 2
jbhr: drgq + wcqp
vcbp: 17
tjbh: 4
znsd: 7
pmqd: 4
gdvd: 2
wmwt: zgwt + dgbq
wsjs: dhzv * ffwp
vnqw: tczr * jdvc
dcpj: wshn + mjlz
vttt: pfcj - ssdw
sfvq: rgft - hvst
zhjh: 3
bjzf: 3
dfhq: jhqc + vzcv
chlm: 2
crvw: 5
zrvm: 4
gvgp: 2
zjls: 5
gsbz: 7
lbsq: 2
ljzq: 17
jzvs: dvwj * vbtn
lmsq: 1
tdrv: 2
wgdz: gztn - brhw
ggrl: 2
jsnn: bfsp + slbn
mhrw: tlln + rvnb
jcvg: fllb * lbhc
cbwd: 19
sdsh: tdgr + bsld
wjcw: 6
bdqd: lfzt - dmrv
hvhh: vmjs + wrtz
ztqr: hdrw / ltht
cdzz: 2
pjsw: npps * rflr
pdpq: 3
rndg: vnqw + wvcp
ztjj: 8
hgvd: 1
drcd: 7
tnph: 2
gzvn: czfg + bvvm
bwwc: 2
bjdm: 6
rcqt: 3
vdcm: 3
dnbf: 8
slpn: 7
zhmm: rbbw + mfdr
rmbw: 3
dmfv: 2
twjs: qphm * ghjz
wfrb: 16
bqcg: 2
blcf: 2
wthz: 17
pzmq: jfpc * fdts
wtzv: 1
ztcj: twsd + vznr
qhsm: 7
bzbl: 5
spsw: pcch - mvqz
hbvm: ffjf + mvcb
whpp: 4
tsjz: 2
wrfg: 4
dtcz: 3
jzzq: 5
lhfl: 4
wlfz: 2
jsdd: 3
vblm: llwg + frwb
fgbc: 4
gdht: 2
vrjh: qcvc + sfqp
zhlw: 5
mmqb: 2
mpwp: 5
jthl: 2
lhjr: chtv * jqqb
nlqd: 6
dmvr: 3
hjtt: zvqc * ncrl
dfrl: 11
zqdn: 7
sgcq: 17
cdmt: 2
cghn: wqwb / qgnp
fzlj: 14
jsfm: hvdm * pwpf
jjll: 5
nsth: bwlp * fhwm
pwpf: 3
qlvq: 3
brhw: 3
ffcb: 2
rhlv: lrnt * sldc
zwcw: 2
nzrf: 2
pczz: cths / ftcs
fmgl: cbrp * lrbg
hffj: 8
jfwb: nfdc + dvch
lslq: 3
dhhl: 5
bwcs: tmlq * rcwr
vcwm: 3
ljcq: qfsr + cgdf
tqht: jdwn * rcpj
mlph: fpln + zmpd
vmbf: 1
hftb: cmjq + sctb
rwjd: lccf * ssrl
fdwb: 4
njvm: 3
wnrg: 13
frwb: 17
jgjt: jnvn + lcqs
gvmt: 3
jtbs: 4
fhsj: cbth + fpfl
qtrq: 3
tctv: 3
hqsc: ltjj - dsgv
jlrd: zgbt + htvh
bgtd: 3
ldhp: 10
tqnr: mrgf + zzsc
bmms: 7
hrcf: 5
vjnm: rggz * nwhj
zlqj: ggsl * dfgf
mclc: tjgr * mhqp
sqqm: llcs + phlb
qngj: hgwq * ztgv
pwvj: 2
drgq: nvhm + hrpc
sdfm: 3
glzv: 7
lsjz: 5
ltgm: pdqw - dlpq
nsft: 3
bhjr: gsnn / mmjg
hjfl: ldzm / trsd
jccl: 2
vhvj: 2
cnrl: ldtj * tcmm
sggr: wrfg * mzlf
rqjv: bhgq + szls
pdvw: 3
hgwq: 4
rtlh: 1
cjhz: sggr + gvpv
pnbq: 3
dcft: bdzv + hfbm
hrqh: ssgd / sffj
lwsf: 8
zzsj: 5
zmdz: 10
mcpq: 1
bbtg: 17
swvt: 7
bwlp: wvbv + tcrs
fjgg: hgfm + zmqs
nhdl: 5
jgdt: mtnv + nsjg
msts: htln + dnzj
ctmb: 4
sfvr: qwrv * dsdl
gdrn: 9
lgml: 3
cvnm: jwdd * tmrn
lnpd: 4
jgqv: sshd * gssw
tcmj: 2
tzlc: rssw + zgpc
cdfv: 20
jtgr: 13
zmnm: 10
nmhj: 2
jnmv: tlcp + sfhl
bptl: 4
gccs: 7
wcmf: jgrd + sggn
hhdt: jrqd * vcmq
mllf: 2
hzzl: gdpq * cgsb
chnn: 2
pzcj: mtgr * bwwc
fdll: bcdp - bpjs
gvvm: 2
zmqg: 10
crmt: fqnj * gzqg
dctp: 2
djgl: 4
djlz: srsn * jvhd
fplq: 7
rbng: 2
qbwb: tjvp * jhnp
hglp: 3
lsnf: 2
mhns: swvt * rcdt
vjmm: bsnj * jnld
jqtr: bpbq * ffbl
zvbq: lvsb * mbvm
scsv: hzzl * zbhd
flrg: 8
qnjj: fjbm * fjmf
zzws: 9
flwv: zdtv * bwzb
cjcv: 5
nbgt: 5
hdhd: qztb + fdbz
dmht: ztpq - rffw
gvcl: slbr + nfth
sbfs: 2
mftw: vdvd + gbzf
mgjp: 5
pvzv: dfpg + bqcg
vvcj: 6
crwn: 11
pscq: ntpb * bbtg
vdds: 3
bncg: ndfs + bzph
qnst: 2
fvfw: 4
sthv: tntq * hvzm
msgs: rqdh * nsfd
pvpm: bmfj * pmgc
drlf: lbsq * nmcz
fjmh: 9
rltm: qrht * dqwq
psqn: ffzr + vblm
mlqd: 10
jnrw: twjn + spps
zgbt: 3
mmqp: hjfw + jqtr
qsnh: 5
hmjd: 12
prcs: 2
qclt: 2
jlqs: 5
bjcq: lztb + wjwl
rzjm: dlww + slrh
shlf: rprc + lvdg
jrzl: vjvf - drlf
pcqv: 3
rlzl: 4
pjbr: 4
fslg: 5
bwmd: 15
mtfb: 2
nvrq: wzfd / vmdd
jfhd: 2
cqwv: 9
sztw: mthq * gwhl
tlsm: 4
bwbf: 5
pctn: 4
lszg: qvdh * dctp
qsps: 2
fjmf: 3
phvc: djlr * bqcp
tvnv: 18
zmfl: drfv * hnfm
szpm: 8
qlgj: nmjh / bcbc
tcrs: 3
mjnj: psqn * qrdv
jdwt: 3
qfws: cbgs + qjbh
dfcq: mzqw * ldhg
cfpd: 2
flbs: zqrv / fvts
mssg: wqcl + pprf
ldtj: 4
jmql: wfqw + gtlb
rjbs: snfn + wdht
dmrv: 4
tnln: 3
wshn: cmbl * nwqn
gngv: hbvm * rszb
fdtt: 4
qppf: hqhq + hzpn
jzbl: 4
ngwj: 2
vwdr: 2
pgjn: wwbp + hgvd
qbpp: vmdv * vnbt
szsp: vgzh * ssqv
ldzm: qfqw * rwbd
mvcb: mvms * zmqw
mhqp: 5
ttdl: jdwt * rptq
jsbf: ddpz + nfdp
qmnl: zhmm + cplv
cglf: zgjs * vbvn
lrcd: cdbh + fgpp
zsds: 13
ttrc: rpmc * wjss
pgfh: 11
mmgf: ghrs + mlqd
vvvv: plzn / mgff
lcnr: 5
nstd: zgjh + jgbv
twpw: hlvv - pczz
hpbd: jbhr + bjcj
rfps: gbgt * qcpj
wgcm: cdnn * jjgj
dsmz: 10
srvc: mgjp * rbtj
dlsl: ncss + dbcq
zfwl: phsg + qgvv
tztg: bvhf + csfw
jzdf: 2
prgq: nqmf + zcnc
cdtw: fzdq + dnlt
wgpb: nrwv * mzln
nwjf: 5
mtdv: 3
jjlc: wjsc * bzcs
pcmt: vmbf + tgsc
ggbq: 10
zlwg: 5
fcpv: 17
wlpd: 4
qzrc: lhtn + dcpr
zrgz: zwcw * gsll
ftmd: gvvm + spqs
qhvb: 3
tsss: pvzv * hstz
ghms: vrsv - wgpb
qdvw: zjtj * dpcb
jhgv: crlj * qtpc
stqf: jfds * sdfm
ftvr: nrll + fscd
phvf: 3
tsbs: bjbh - qdvw
fjqj: 4
gggp: fvzt * wfgb
qffr: whfj * vsgm
trqq: qhvb * phns
psff: fhlv + wtms
grlr: nfjb + nszn
fsjb: gccs * rvvp
mvqg: 3
wwhd: 3
pplj: qdzs * nlzf
tznp: blpt * zwjz
nbhw: 5
jggr: 11
lfvh: 3
bmzl: 2
jcnl: 2
nvgd: fjgs / dgtf
mjfm: 1
ddgz: 13
nwhj: zmdz * lsnf
sjml: vpsg + ngws
grls: jvtm - fqsq
ssgd: bwcs + fsgs
dtng: 3
bldw: 4
jqrv: qprn - nbnr
htfq: vtzh * pscq
bvms: 2
zcgj: 9
mlhv: hhhj - wvtn
qwmh: 12
root: cmmh + lqcd
twlq: 3
rfhg: rmvf * cmqj
hpnf: rmbw * zhfw
rsjl: 2
jcmn: 3
tcmm: 4
vmjs: 4
fljr: zstd + qrmq
jgtp: tstz * tplz
qnrb: nwrc * dsbz
jpjg: fzpr / ddtb
gbwr: 16
rllv: qmhs - gfvt
tzgh: 12
mchl: 6
hrvb: 2
qmcn: 2
whbs: 6
cdmf: 4
sfdc: 2
tjtf: wfrb + vhmr
mbvm: lchl + pcqv
gqsv: 2
nrlm: 4
dfbs: 19
mtgr: 5
wwhn: 7
cnqd: sfnd + zmnm
bhst: tztq * bdsp
gpdf: 18
ztpq: cwfh / dzdl
cflt: cvgw * qzrl
jmqc: fplq * tbdt
wlmt: pjvv * tslh
sftz: wqsz * fgcz
sllh: hvpm * zhjh
clmj: 20
lwwv: bhhd * vwdh
jqjn: mqcf * qvbc
fcmm: zftl + zzrg
hffd: 3
lgtg: vqfz + rhlv
cqpq: hhfn * wmwt
fnrj: 2
dzgh: rrdt * vvdh
hgfm: 1
rwpg: 2
cpgp: btqt + zchz
rsrg: 4
bpjs: 4
cmmh: mftw / thvf
nccm: mcvd * qnrb
stqm: 7
vqfz: gplp + grww
nbzs: hfwq - ghms
mwlv: 2
wqjc: 2
fgpp: 1
sggn: sbjj / wtjd
trsw: 1
hdhh: 7
shgh: 2
phhn: 3
nrgn: 4
wgcc: lltb + cgtt
zbhd: 2
nlzf: trsv + pgwl
vgzm: 5
bbdp: 2
wqpd: 2
twmq: nlqd * rhzv
tslh: 6
qcvc: vzfb * fbvq
rncs: hmlc - jflz
hzsb: mmnc + crwn
tgvq: 17
mtbw: 2
zbvg: 2
zjrn: mssg + wjfl
tggw: 2
flnh: cfqj + mdbb
ftcs: 3
fdts: 3
mlpc: 12
bzjl: 2
btfl: gbbq * rgzl
pnvb: 2
hqfd: jgtl * pwtw
ncmf: dpsq * zwvm
nzfc: 4
rcgq: nnnj * gnml
fltq: 2
jtmp: wnrq + mcsq
sshd: 2
rpbj: frhs * bwct
brpg: 3
gjwv: 16
rqsr: 2
bqvc: 2
svnl: 7
jfhw: pfjq + lfvh
bsbm: lvcv + bdcd
lhms: 9
vncp: 3
sctb: mjnj + hbct
qbvj: 4
bwct: 3
rplw: vcfs * jwhh
bsln: hzvb + pvtc
mpmw: 2
slbn: dpff + bftc
rqwj: 2
mwrs: nbwp + gzzn
gtnh: dqfv * sjml
nlsn: 5
jzws: 7
cgzf: qftw + trtp
lmhw: 1
crll: 5
jsth: nvrq * qqsm
glwf: ppmz * zrlm
mctq: 2
wjhp: 18
rgqz: 17
spnp: 2
ztdg: wcdl * mgnp
ndfs: lnpd * rrvl
pcqb: 14
hhhj: cjns / pctn
pdws: 1
mtgj: grls / ltbw
nrwv: crmt + blzz
wcnm: 10
npzp: sjfz + ncrw
rzdm: ldlm / ddzv
wvtn: zsrv + jpgl
cqfv: rhtj * ldpl
bswg: 4
lnjh: lvfw + sqcg
dbww: hmst / hndv
pvgs: 3
lrvd: nzrf * npfq
snfc: bbwf * sbfs
qqrc: 5
ptgl: 3
cnjd: 2
fnvc: 1
jwzg: 4
jtgw: 8
dfbb: 12
htfw: qbvh / ttzl
lzzc: vcwm * wvvn
ncms: 2
cgjq: 2
gljm: 9
mwld: fdzg * fnrj
lztb: 1
ftff: ztzs + pqgw
jqlz: 5
mcvd: zphw - frng
vzfb: 2
ftlc: wjgw + vjnm
rsvh: stqm + qwmh
jjgj: 5
lczl: 4
ghpp: 6
dqbl: lgzl * ffqg
nnnj: 3
frvm: tmjz * wqcb
rrjw: gjvn - hwzc
vscb: lgnv * wbmb
rcpj: bvct * hglp
ngdr: lbfj * lhjr
qfjz: jzvs + vsww
zsbf: 4
grnq: rhnq * btlw
qpnb: 6
vbtn: 7
shhd: ttdm + hwpf
rnvg: 5
gsll: gztb / cnvz
vnpg: 5
gbwt: 9
vtnb: 2
sbjj: nzsf * lhjg
dbcq: 17
tgvw: tctv * rwzs
tmjz: 2
mgbt: rmnj * qrbl
fqsl: 2
tplc: 3
gwhl: qdwb * bvhc
frng: bltw + czwl
wczp: vtrg / wvlj
ccgl: tshc * lhjp
fcwc: ldll * szhw
wrtz: 3
mqcf: 2
lhrb: 11
pvvz: 1
wfpw: 3
csfw: rwbw + hszl
rcrn: gwng + fzdv
qlsv: 7
ghjz: twpw + mbff
nsjg: wbgj * dswj
qrdt: lmhw + wqqs
mpcw: bjcg + mtgj
hvst: lnzd * smtb
wtjd: 2
ztsc: whmr + sqjc
vjms: flrf * hvhh
rgzl: 2
twsd: 2
ctcv: 3
jwhz: 9
dswj: 3
wmgs: cglf + htrz
jqtn: 2
hndv: 2
lcnl: rmst + bvfb
tpwc: zhvv * bptl
dmnr: rfld * zhsb
djfm: phhn * fsjm
ncss: ldhp * hmjj
ddng: wcts + jmzq
nggb: sqbp / jffc
wgdj: rsvh * qfdb
ffrs: vpcz * jgfv
hwjv: 3
jdqm: 6
wsmr: 4
llsb: zttm * hcft
rbbw: 3
zhrv: 2
mtbd: szpm + dbwm
slmq: 2
tvvc: 4
zvfj: 3
nfld: lsnn * cghn
vpsg: ccgl + vjrf
wfqw: fcfg + wbgd
nqnj: 14
bccc: 6
qnqm: 7
hmvd: rhcm * dzsd
nrll: zqng + mgbt
bdfn: nlfj / vrmf
zfwz: 2
swfb: rpbj * rwpg
cwfh: qtmc + bqfr
rjzb: qsvs / ctmb
btsb: 5
hlvv: gvnf * stqf
njqv: rllf * drgv
nzct: 5
qcpj: 2
sfnd: 1
rvnb: cnrf - svmj
qwtd: cbsh * pfgm
nfdc: gwhj * ldsg
rfpp: 4
sqbp: gqvl + mrfh
vjrc: 6
sfhr: fppl * ffrs
zdzd: pvzm + rlzl
tbcp: jcvg + jjhz
wmcc: lhzw - hhlp
nfth: 5
dtzr: 5
qdhf: crsr * qfws
vwdh: 2
trsv: qdsp * vtvc
wcts: htfw * wzwg
hzsz: scpp / rlpc
dchc: 3
pcwg: mggf * ffcb
bflw: mbjj * npzp
bssg: 8
gjzd: wsqc + gljm
fqvp: fpjz * jfvq
blzz: 4
sqjc: 4
brgl: szsp + cwzp
tbcn: 5
wdqg: 12
hrpj: tlsm * wvzf
mmdn: wsvt / jrff
ttdb: 5
vbsq: 7
tjsh: 2
fqsq: clvr * cqwj
dvwj: ztgz + fnvc
dwsf: 3
jmpm: 9
twfc: 2
lrjt: 15
vmgd: 2
tthg: tfhl * mnrb
wnts: jcmn * lcvl
hwqn: sdlg * mpqd
rcnf: 3
gdcz: fqwg + sfvr
vdwz: qsps + hwpm
rmst: 5
wfgd: 2
twfp: 2
ctwm: hvnh * hqcr
wqww: 3
qrvb: mdth + jwwv
qnbq: frhz + rjzb
mbsg: qrvv * fbfw
qzfc: 2
wbvs: wscg * fhbz
rmvf: 5
rrvl: 2
nszn: 6
hdqj: trqq * pcbf
mnqr: 2
hfhg: 4
fbfw: mwrs * swsl
glfn: mngc + phvf
wbtp: ztgp * lwlf
ddzt: mvvw + zwdh
hqhq: jnnf + pbnt
mffj: 3
lvjc: 15
pmgc: cwmh + lwsf
dhbn: wdqg + ndls
njml: tvsb * hrbw
zmqw: hssr + gddf
mmrj: 5
twpz: 5
ztgv: 2
zbcl: 1
nvsn: wzqv * nqnj
vjvf: zjls * sdzt
znmw: cgcr * rgph
rdfw: 11
mnrb: 3
vbvq: tsbs / gvhl
bnvj: bgtd * bjzf
qtpc: 2
vbvn: 5
gbhh: 2
rsjz: 5
jfpp: 4
tfhl: 5
vwff: 15
wwnv: qpqz * lsmj
qfsr: jbll * mtfb
hchc: flwv + tmdg
jhnm: zhzh + vjrc
gwsj: 3
rqdh: glwf + jfhw
dzpf: 6
hqcr: htfq + jpww
gjvn: nzgr + tmvm
mdth: lrtf + tghc
wbww: 6
thnv: 1
qdgt: nmsw + vhvt
thvf: tcqs * fbcn
pzhn: fnlf + fsjb
fdzg: qfcc - vqrl
whmr: 5
gqmm: rzdm + qbwb
fwts: mwhc + stts
zdtv: 3
hphm: srvn * pcwf
zmqs: 18
gltm: 1
mzlf: vblp / ngpn
rwzs: 13
tvnn: ncvb + qswj
mdsg: 5
zpdz: 4
tghc: rmpb * hghb
hnnc: hscp * fhnd
rmwq: tvnv * ghwf
tbrr: bmvr * dfbs
fmrn: pnvb * rtmn
bbqm: 16
qrht: 5
lsgj: dfdj + tqmt
cdjs: 2
nctg: 3
shtd: nwjf + gpdf
hrzn: 8
jbjr: mpln * ppdc
mthq: 6
jnfh: jfjr + ggdf
snfn: wpcr * fcvv
rtqf: ggbq + gfqb
cccd: 6
mmnc: swrm * flrg
gfvd: mdtq / thll
vcgm: rldw + gjfs
vjqw: zclh + dlsl
bncm: 1
vwpz: 2
rgcc: vtgs + fnbt
hcnl: tsmn * ncms
bltw: zzws * fmmf
tvpw: 5
ncrl: mbnd * dnsq
lspd: 5
tvhz: 2
vpcz: 3
rtls: 12
nqmf: 1
fzdq: lrjt + mfht
gttj: 10
dsgv: nfwz * nmnb
qrfb: rdpn + vjms
bhgq: pvhb / wdtq
pcwf: 5
hnlg: qwtd + dwcc
gjtn: lmsq + tgqj
bftc: rmzd / blcf
wdtq: 2
tczr: twfp * npdl
tgpl: 3
bvrt: svdh + vzjj
smsv: qzqn + bpqf
mgnh: 2
rzpd: 3
njls: wnnw - hhft
bghn: drwq + gvcl
pwtw: 4
hldg: nvsn + cmsm
wflp: 2
szmq: qlrp + ffbb
zhsb: 2
mvfd: hrdq - jgjt
hspq: 6
pvbm: 3
ldsg: jzhv + hjtt
stts: 19
rdlj: 8
zqhc: 6
bsjd: snlb + mbvp
flbc: 2
hhws: 3
llpt: 4
hpsd: 5
hssr: qvvz * cbwd
nqbb: 5
rwjq: 4
trbc: 5
cqfj: 4
cwhv: qffr + pzmv
glcp: 5
rldw: qbjs + tccn
qfdb: 5
jqgq: 2
gzzn: nbsm + jsgf
sjbl: jpvm - mtbn
zjzg: 2
shbs: gtnh + bpqv
zlbn: lswc + phgs
cgtt: nfld + npmr
jhzh: jsth / jfmw
pghl: 7
lmzn: 4
mhsb: sqjp * lszg
nbjv: rwbv + zrct
mhlq: 13
sfrh: 2
ltbw: 2
qzrl: qrjp + ngdr
tvpt: 9
fbvr: 3
whhq: dvjp * ngpw
cwmh: 9
mdfl: jtgr * dbtv
gfvt: 2
pqcq: ngts + zbcl
grww: rbsd * wwcb
jgrd: whhq * nlzz
bhtd: 4
vsgm: trdj + sthv
qztb: wgdz + pdws
hwzc: 5
gzqg: fjqj + qlmr
mrgf: msqc + brzb
hfwq: wcmf * slmq
dzrr: qbwh - cwhv
cfrw: vcbp * qlqm
lzlc: jsnn * ngdb
zhzh: 5
rbmj: 11
qsjv: shhd + pzmf
dzmr: wmgs + vcgm
sgtc: 3
wfvj: 3
qnvh: zbvg * gsgz
htqc: lmzn * tmws
dzsd: 3
qqns: 2
srtw: 4
fpgb: 2
cdhc: 1
brzb: cbtp / hmfz
mbff: ptns + tznp
bqps: lrvd + qtrq
wfvn: lngb * qflr
hpzp: bstm + vtmg
bhhd: jcml / pjns
jjhz: ldjl * pgtr
dhvc: 5
vrqr: 6
cfqb: 1
fqhm: 2
qqsb: dndl * pwvj
bzcs: ggvp + qswr
dzdl: 3
zjsq: 3
dwpr: rlbh * ftjq
vbvf: vvvv + cqpq
zjhc: svlt * trfr
rqww: sgtb * ndqp
jtsm: 2
dtmc: 2
nbcn: 6
cftg: vqwj * lslq
snlb: 2
pvmr: jqgq * dmsc
npmr: cbdh * zjwd
fmpb: zctg + bpcd
zvpg: lspd * dmfv
bwln: 2
hqhg: 5
nhdh: fpmm + bnht
gdng: 2
jlnl: 3
snrq: 13
tptb: 9
vjlj: 5
djqz: 2
dchq: 7
glvv: 9
nvrs: jjsp + fcph
mnwz: tcbf + wrnc
lmfs: ltvh + nwvm
tqmt: vpgc * tgzs
tfjh: vpwc + tbzw
gsgz: 3
spqs: whhz - hplh
vgvn: 2
mqzt: wzmr + brgl
cwtn: sdps / hpsd
tvsb: 3
zwlr: bvrt + wgjh
vdcc: 20
rhww: dchc * brms
qswr: gsbz * ghvr
hqpr: 1
ldll: 6
ppmz: hdjq * wtrl
phsg: njth * qgcr
fsdl: wmjq * jjlm
zwpz: 3
ctdc: rncs * jfhd
nzrg: 3
wljp: srtw * wqjc
tddw: vsgv + qmnl
ttwc: 6
lmdn: 1
bcbc: 2
hcld: cmdv + vbfg
dszz: hwzd / spnp
qzzl: 5
sdlg: 2
vnfm: wpwv * cqwv
gztn: gwdd + cjcv
lflw: dzpf * jthd
ztgf: 3
hwfc: qbjq * svtw
lfzt: sgcm + phpv
tlcp: 9
bmtp: 4
nchz: nwcf * tstj
nsrz: cnqd * flbc
dbgq: 3
hhzb: 2
blnl: gttj + rddv
zqsj: 12
brcp: ddgz * ggpd
dtrf: bfsn + zlwg
twmv: 2
zjdv: 1
fjpw: 4
hzpn: fvbf + hgrc
bzhv: 5
znrr: jhtt + dfcq
jsgf: 10
cmvs: 2
cjvt: jjll * rbgb
`.trim().split('\n')

console.log(resolveRoot(test))
console.log(resolveHumn(test))
