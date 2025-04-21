function fewestToken(input, error = 0) {
  return input.reduce((sum, row) => {
    const dis = row.a * row.d - row.b * row.c;
    if (dis === 0) return sum;
    const A = (row.d * (row.e + error) - row.b * (row.f + error)) / dis;
    const B = (row.a * (row.f + error) - row.c * (row.e + error)) / dis;
    if (A > Math.floor(A) || B > Math.floor(B)) return sum;
    return sum + 3 * A + B
  }, 0);
}

function parse(block) {
  const matrix = block.split('\n').map(line =>
    line
      .split(': ')[1]
      .split(', ')
      .map(part => Number(part.slice(2)))
  );
  return {
    a: matrix[0][0],
    b: matrix[1][0],
    c: matrix[0][1],
    d: matrix[1][1],
    e: matrix[2][0],
    f: matrix[2][1]
  };
}

const test = `
Button A: X+71, Y+36
Button B: X+28, Y+62
Prize: X=11070, Y=4082

Button A: X+37, Y+17
Button B: X+24, Y+58
Prize: X=5634, Y=7098

Button A: X+36, Y+14
Button B: X+32, Y+53
Prize: X=2876, Y=2619

Button A: X+75, Y+23
Button B: X+13, Y+53
Prize: X=2287, Y=2483

Button A: X+58, Y+13
Button B: X+16, Y+56
Prize: X=12372, Y=6522

Button A: X+11, Y+57
Button B: X+37, Y+15
Prize: X=12481, Y=1811

Button A: X+33, Y+70
Button B: X+90, Y+20
Prize: X=4719, Y=4370

Button A: X+72, Y+39
Button B: X+12, Y+46
Prize: X=12140, Y=8501

Button A: X+19, Y+28
Button B: X+72, Y+25
Prize: X=4814, Y=3769

Button A: X+20, Y+54
Button B: X+21, Y+12
Prize: X=10924, Y=10772

Button A: X+40, Y+59
Button B: X+61, Y+11
Prize: X=7369, Y=5420

Button A: X+49, Y+58
Button B: X+72, Y+21
Prize: X=3264, Y=2001

Button A: X+37, Y+11
Button B: X+18, Y+37
Prize: X=2524, Y=1415

Button A: X+17, Y+65
Button B: X+73, Y+12
Prize: X=15467, Y=2971

Button A: X+21, Y+98
Button B: X+63, Y+30
Prize: X=1575, Y=5766

Button A: X+55, Y+80
Button B: X+70, Y+17
Prize: X=5615, Y=3163

Button A: X+32, Y+87
Button B: X+53, Y+41
Prize: X=4391, Y=4206

Button A: X+75, Y+19
Button B: X+15, Y+86
Prize: X=3900, Y=7564

Button A: X+89, Y+33
Button B: X+24, Y+46
Prize: X=5666, Y=2880

Button A: X+49, Y+11
Button B: X+20, Y+63
Prize: X=1791, Y=6849

Button A: X+40, Y+11
Button B: X+90, Y+99
Prize: X=7420, Y=5159

Button A: X+53, Y+40
Button B: X+17, Y+89
Prize: X=4786, Y=9858

Button A: X+21, Y+38
Button B: X+49, Y+24
Prize: X=3336, Y=13878

Button A: X+16, Y+54
Button B: X+77, Y+42
Prize: X=687, Y=1022

Button A: X+15, Y+64
Button B: X+47, Y+29
Prize: X=4698, Y=3063

Button A: X+50, Y+28
Button B: X+14, Y+44
Prize: X=880, Y=1216

Button A: X+39, Y+59
Button B: X+23, Y+11
Prize: X=4565, Y=2321

Button A: X+67, Y+12
Button B: X+35, Y+48
Prize: X=2373, Y=2136

Button A: X+16, Y+43
Button B: X+38, Y+17
Prize: X=2918, Y=6953

Button A: X+41, Y+19
Button B: X+13, Y+28
Prize: X=1539, Y=9097

Button A: X+76, Y+54
Button B: X+14, Y+35
Prize: X=14106, Y=12969

Button A: X+57, Y+80
Button B: X+38, Y+16
Prize: X=10323, Y=10416

Button A: X+35, Y+12
Button B: X+39, Y+58
Prize: X=11937, Y=15022

Button A: X+69, Y+33
Button B: X+16, Y+71
Prize: X=4456, Y=4475

Button A: X+12, Y+43
Button B: X+40, Y+12
Prize: X=17004, Y=4223

Button A: X+20, Y+85
Button B: X+23, Y+14
Prize: X=3141, Y=6063

Button A: X+21, Y+51
Button B: X+61, Y+21
Prize: X=15151, Y=5111

Button A: X+66, Y+27
Button B: X+15, Y+41
Prize: X=9083, Y=19379

Button A: X+67, Y+18
Button B: X+38, Y+59
Prize: X=6410, Y=5479

Button A: X+44, Y+11
Button B: X+25, Y+59
Prize: X=10774, Y=5609

Button A: X+21, Y+44
Button B: X+58, Y+34
Prize: X=12929, Y=18532

Button A: X+61, Y+22
Button B: X+23, Y+53
Prize: X=3055, Y=2890

Button A: X+28, Y+56
Button B: X+52, Y+31
Prize: X=16512, Y=11479

Button A: X+40, Y+95
Button B: X+97, Y+53
Prize: X=11309, Y=13201

Button A: X+69, Y+25
Button B: X+16, Y+54
Prize: X=4474, Y=4820

Button A: X+21, Y+45
Button B: X+55, Y+28
Prize: X=817, Y=10732

Button A: X+48, Y+17
Button B: X+23, Y+51
Prize: X=9122, Y=12093

Button A: X+45, Y+72
Button B: X+97, Y+39
Prize: X=10579, Y=5655

Button A: X+43, Y+18
Button B: X+18, Y+57
Prize: X=16041, Y=17189

Button A: X+60, Y+12
Button B: X+25, Y+72
Prize: X=1960, Y=1556

Button A: X+18, Y+65
Button B: X+78, Y+30
Prize: X=13862, Y=5235

Button A: X+41, Y+68
Button B: X+74, Y+31
Prize: X=9642, Y=9020

Button A: X+16, Y+70
Button B: X+45, Y+48
Prize: X=2546, Y=4886

Button A: X+30, Y+67
Button B: X+81, Y+22
Prize: X=3615, Y=2512

Button A: X+31, Y+53
Button B: X+41, Y+21
Prize: X=702, Y=6594

Button A: X+41, Y+13
Button B: X+37, Y+78
Prize: X=9187, Y=796

Button A: X+76, Y+11
Button B: X+16, Y+73
Prize: X=15600, Y=13632

Button A: X+32, Y+61
Button B: X+49, Y+13
Prize: X=11800, Y=14501

Button A: X+68, Y+90
Button B: X+87, Y+19
Prize: X=8537, Y=8703

Button A: X+43, Y+17
Button B: X+25, Y+47
Prize: X=540, Y=696

Button A: X+14, Y+87
Button B: X+67, Y+67
Prize: X=2338, Y=4747

Button A: X+27, Y+42
Button B: X+48, Y+24
Prize: X=15440, Y=12416

Button A: X+28, Y+53
Button B: X+83, Y+19
Prize: X=2106, Y=948

Button A: X+71, Y+66
Button B: X+19, Y+86
Prize: X=5917, Y=5842

Button A: X+14, Y+62
Button B: X+63, Y+13
Prize: X=16370, Y=14574

Button A: X+29, Y+68
Button B: X+58, Y+16
Prize: X=17345, Y=2180

Button A: X+40, Y+97
Button B: X+99, Y+52
Prize: X=8340, Y=8940

Button A: X+62, Y+24
Button B: X+14, Y+53
Prize: X=5414, Y=4903

Button A: X+70, Y+18
Button B: X+20, Y+57
Prize: X=10150, Y=6539

Button A: X+38, Y+81
Button B: X+51, Y+14
Prize: X=9972, Y=8730

Button A: X+36, Y+86
Button B: X+95, Y+22
Prize: X=8693, Y=4576

Button A: X+36, Y+62
Button B: X+47, Y+15
Prize: X=19228, Y=7898

Button A: X+51, Y+12
Button B: X+12, Y+38
Prize: X=695, Y=3828

Button A: X+25, Y+93
Button B: X+73, Y+22
Prize: X=3540, Y=5682

Button A: X+87, Y+14
Button B: X+82, Y+89
Prize: X=6394, Y=5653

Button A: X+38, Y+51
Button B: X+64, Y+15
Prize: X=5826, Y=2502

Button A: X+52, Y+23
Button B: X+15, Y+39
Prize: X=2199, Y=2688

Button A: X+89, Y+88
Button B: X+85, Y+15
Prize: X=13130, Y=9185

Button A: X+50, Y+21
Button B: X+33, Y+68
Prize: X=6838, Y=8367

Button A: X+62, Y+24
Button B: X+16, Y+75
Prize: X=2298, Y=3573

Button A: X+21, Y+11
Button B: X+13, Y+52
Prize: X=7026, Y=19460

Button A: X+76, Y+24
Button B: X+13, Y+66
Prize: X=15258, Y=11684

Button A: X+11, Y+79
Button B: X+81, Y+12
Prize: X=18751, Y=15255

Button A: X+41, Y+63
Button B: X+97, Y+28
Prize: X=3745, Y=2002

Button A: X+65, Y+13
Button B: X+14, Y+47
Prize: X=5920, Y=4803

Button A: X+20, Y+42
Button B: X+53, Y+28
Prize: X=11412, Y=19338

Button A: X+91, Y+14
Button B: X+44, Y+95
Prize: X=4336, Y=7902

Button A: X+78, Y+33
Button B: X+14, Y+57
Prize: X=13996, Y=12770

Button A: X+73, Y+36
Button B: X+29, Y+91
Prize: X=3984, Y=2655

Button A: X+85, Y+23
Button B: X+36, Y+93
Prize: X=5293, Y=1682

Button A: X+14, Y+29
Button B: X+55, Y+17
Prize: X=18273, Y=16750

Button A: X+72, Y+31
Button B: X+22, Y+96
Prize: X=6260, Y=4945

Button A: X+14, Y+35
Button B: X+89, Y+63
Prize: X=6363, Y=5859

Button A: X+36, Y+46
Button B: X+78, Y+21
Prize: X=8208, Y=4824

Button A: X+49, Y+35
Button B: X+15, Y+40
Prize: X=2800, Y=2205

Button A: X+17, Y+73
Button B: X+77, Y+24
Prize: X=11606, Y=3995

Button A: X+41, Y+14
Button B: X+11, Y+26
Prize: X=11919, Y=7986

Button A: X+14, Y+49
Button B: X+79, Y+37
Prize: X=18317, Y=6795

Button A: X+73, Y+34
Button B: X+12, Y+38
Prize: X=2662, Y=1726

Button A: X+16, Y+49
Button B: X+94, Y+20
Prize: X=9686, Y=4751

Button A: X+14, Y+27
Button B: X+64, Y+18
Prize: X=2948, Y=2628

Button A: X+17, Y+45
Button B: X+65, Y+23
Prize: X=18786, Y=4870

Button A: X+72, Y+24
Button B: X+14, Y+65
Prize: X=17128, Y=3232

Button A: X+30, Y+99
Button B: X+77, Y+32
Prize: X=5474, Y=6515

Button A: X+13, Y+45
Button B: X+56, Y+17
Prize: X=2382, Y=10382

Button A: X+45, Y+25
Button B: X+14, Y+49
Prize: X=3917, Y=17952

Button A: X+37, Y+74
Button B: X+95, Y+56
Prize: X=4874, Y=5326

Button A: X+68, Y+33
Button B: X+19, Y+45
Prize: X=2428, Y=2075

Button A: X+29, Y+50
Button B: X+48, Y+22
Prize: X=19099, Y=4406

Button A: X+38, Y+16
Button B: X+13, Y+57
Prize: X=2104, Y=12026

Button A: X+90, Y+69
Button B: X+29, Y+80
Prize: X=9163, Y=11473

Button A: X+79, Y+68
Button B: X+14, Y+72
Prize: X=3320, Y=4896

Button A: X+35, Y+12
Button B: X+15, Y+55
Prize: X=4820, Y=18897

Button A: X+99, Y+21
Button B: X+14, Y+50
Prize: X=4977, Y=1479

Button A: X+19, Y+99
Button B: X+81, Y+83
Prize: X=5945, Y=7921

Button A: X+43, Y+73
Button B: X+46, Y+19
Prize: X=17648, Y=6701

Button A: X+58, Y+11
Button B: X+25, Y+54
Prize: X=18343, Y=17652

Button A: X+20, Y+94
Button B: X+64, Y+51
Prize: X=3492, Y=4422

Button A: X+15, Y+55
Button B: X+49, Y+19
Prize: X=12740, Y=12080

Button A: X+12, Y+37
Button B: X+72, Y+33
Prize: X=15440, Y=2614

Button A: X+29, Y+12
Button B: X+25, Y+64
Prize: X=1287, Y=9136

Button A: X+37, Y+11
Button B: X+42, Y+67
Prize: X=14346, Y=15460

Button A: X+86, Y+62
Button B: X+19, Y+44
Prize: X=2130, Y=4384

Button A: X+37, Y+15
Button B: X+52, Y+77
Prize: X=5086, Y=12147

Button A: X+44, Y+13
Button B: X+27, Y+45
Prize: X=17953, Y=16833

Button A: X+54, Y+28
Button B: X+12, Y+23
Prize: X=3386, Y=1885

Button A: X+38, Y+83
Button B: X+44, Y+12
Prize: X=14042, Y=10617

Button A: X+48, Y+21
Button B: X+41, Y+63
Prize: X=16496, Y=11498

Button A: X+60, Y+15
Button B: X+17, Y+60
Prize: X=1402, Y=1800

Button A: X+71, Y+22
Button B: X+64, Y+85
Prize: X=5542, Y=4324

Button A: X+18, Y+33
Button B: X+52, Y+20
Prize: X=7172, Y=7088

Button A: X+38, Y+22
Button B: X+28, Y+51
Prize: X=18372, Y=6539

Button A: X+14, Y+58
Button B: X+43, Y+14
Prize: X=16384, Y=4248

Button A: X+22, Y+42
Button B: X+96, Y+20
Prize: X=7618, Y=2298

Button A: X+14, Y+38
Button B: X+53, Y+24
Prize: X=3038, Y=18746

Button A: X+16, Y+72
Button B: X+57, Y+15
Prize: X=959, Y=16121

Button A: X+43, Y+31
Button B: X+14, Y+37
Prize: X=1473, Y=16940

Button A: X+53, Y+17
Button B: X+68, Y+80
Prize: X=5859, Y=5487

Button A: X+32, Y+57
Button B: X+82, Y+27
Prize: X=6588, Y=2448

Button A: X+89, Y+58
Button B: X+13, Y+81
Prize: X=7473, Y=7336

Button A: X+26, Y+46
Button B: X+20, Y+11
Prize: X=18330, Y=10806

Button A: X+25, Y+15
Button B: X+42, Y+76
Prize: X=3344, Y=3632

Button A: X+14, Y+78
Button B: X+74, Y+13
Prize: X=15350, Y=2785

Button A: X+71, Y+29
Button B: X+12, Y+34
Prize: X=14521, Y=18923

Button A: X+73, Y+34
Button B: X+12, Y+48
Prize: X=720, Y=16152

Button A: X+85, Y+27
Button B: X+13, Y+65
Prize: X=5833, Y=2823

Button A: X+55, Y+19
Button B: X+32, Y+85
Prize: X=3032, Y=7037

Button A: X+32, Y+95
Button B: X+77, Y+20
Prize: X=6672, Y=3120

Button A: X+22, Y+57
Button B: X+48, Y+17
Prize: X=5786, Y=18402

Button A: X+47, Y+21
Button B: X+22, Y+56
Prize: X=17968, Y=8824

Button A: X+32, Y+16
Button B: X+33, Y+52
Prize: X=3973, Y=17268

Button A: X+78, Y+27
Button B: X+56, Y+74
Prize: X=6540, Y=4230

Button A: X+22, Y+50
Button B: X+31, Y+18
Prize: X=4064, Y=9688

Button A: X+26, Y+12
Button B: X+33, Y+52
Prize: X=14477, Y=896

Button A: X+30, Y+12
Button B: X+18, Y+51
Prize: X=16010, Y=7724

Button A: X+43, Y+70
Button B: X+45, Y+11
Prize: X=14829, Y=11408

Button A: X+60, Y+50
Button B: X+24, Y+81
Prize: X=4776, Y=9714

Button A: X+47, Y+30
Button B: X+19, Y+42
Prize: X=1440, Y=1188

Button A: X+56, Y+50
Button B: X+19, Y+69
Prize: X=1365, Y=4497

Button A: X+68, Y+16
Button B: X+24, Y+69
Prize: X=11172, Y=19471

Button A: X+19, Y+39
Button B: X+35, Y+19
Prize: X=4871, Y=16075

Button A: X+45, Y+15
Button B: X+30, Y+61
Prize: X=17825, Y=6433

Button A: X+54, Y+52
Button B: X+27, Y+95
Prize: X=5751, Y=8781

Button A: X+56, Y+75
Button B: X+89, Y+32
Prize: X=6311, Y=4354

Button A: X+38, Y+19
Button B: X+21, Y+47
Prize: X=11926, Y=15969

Button A: X+11, Y+54
Button B: X+73, Y+30
Prize: X=2574, Y=5412

Button A: X+28, Y+59
Button B: X+93, Y+47
Prize: X=9910, Y=7475

Button A: X+18, Y+52
Button B: X+68, Y+15
Prize: X=3636, Y=2339

Button A: X+17, Y+42
Button B: X+57, Y+23
Prize: X=4324, Y=2760

Button A: X+11, Y+78
Button B: X+78, Y+11
Prize: X=13060, Y=17147

Button A: X+14, Y+40
Button B: X+46, Y+27
Prize: X=4492, Y=8697

Button A: X+36, Y+16
Button B: X+49, Y+69
Prize: X=19185, Y=18985

Button A: X+46, Y+82
Button B: X+49, Y+12
Prize: X=1674, Y=5814

Button A: X+72, Y+24
Button B: X+12, Y+53
Prize: X=9872, Y=12860

Button A: X+61, Y+18
Button B: X+16, Y+25
Prize: X=6483, Y=2785

Button A: X+23, Y+14
Button B: X+28, Y+84
Prize: X=3501, Y=5278

Button A: X+15, Y+53
Button B: X+60, Y+33
Prize: X=17210, Y=4459

Button A: X+74, Y+11
Button B: X+13, Y+57
Prize: X=8509, Y=12451

Button A: X+69, Y+44
Button B: X+23, Y+48
Prize: X=2354, Y=16704

Button A: X+47, Y+18
Button B: X+36, Y+67
Prize: X=10074, Y=17503

Button A: X+57, Y+37
Button B: X+25, Y+63
Prize: X=3079, Y=2747

Button A: X+22, Y+70
Button B: X+58, Y+16
Prize: X=5202, Y=12288

Button A: X+47, Y+78
Button B: X+97, Y+22
Prize: X=11118, Y=6360

Button A: X+11, Y+64
Button B: X+36, Y+14
Prize: X=9222, Y=7328

Button A: X+62, Y+19
Button B: X+22, Y+74
Prize: X=15984, Y=6028

Button A: X+13, Y+37
Button B: X+63, Y+31
Prize: X=7836, Y=10116

Button A: X+46, Y+14
Button B: X+17, Y+95
Prize: X=2048, Y=4396

Button A: X+68, Y+22
Button B: X+27, Y+74
Prize: X=5147, Y=5598

Button A: X+33, Y+84
Button B: X+90, Y+68
Prize: X=9996, Y=10624

Button A: X+64, Y+39
Button B: X+11, Y+32
Prize: X=16372, Y=10838

Button A: X+35, Y+82
Button B: X+63, Y+22
Prize: X=5530, Y=5420

Button A: X+46, Y+76
Button B: X+32, Y+14
Prize: X=15888, Y=9432

Button A: X+43, Y+19
Button B: X+31, Y+45
Prize: X=733, Y=1707

Button A: X+37, Y+90
Button B: X+44, Y+23
Prize: X=6418, Y=8301

Button A: X+11, Y+48
Button B: X+40, Y+12
Prize: X=15600, Y=18416

Button A: X+16, Y+35
Button B: X+27, Y+12
Prize: X=9996, Y=14929

Button A: X+51, Y+13
Button B: X+11, Y+40
Prize: X=12092, Y=14309

Button A: X+32, Y+18
Button B: X+21, Y+46
Prize: X=16450, Y=15374

Button A: X+14, Y+64
Button B: X+46, Y+18
Prize: X=19110, Y=11410

Button A: X+60, Y+49
Button B: X+33, Y+99
Prize: X=6681, Y=11004

Button A: X+26, Y+58
Button B: X+43, Y+23
Prize: X=1444, Y=15036

Button A: X+22, Y+53
Button B: X+53, Y+14
Prize: X=6686, Y=12477

Button A: X+66, Y+13
Button B: X+23, Y+66
Prize: X=4631, Y=19251

Button A: X+62, Y+30
Button B: X+13, Y+36
Prize: X=13407, Y=13286

Button A: X+68, Y+14
Button B: X+57, Y+71
Prize: X=7458, Y=5684

Button A: X+11, Y+31
Button B: X+64, Y+41
Prize: X=352, Y=18381

Button A: X+36, Y+16
Button B: X+14, Y+27
Prize: X=15030, Y=19575

Button A: X+17, Y+50
Button B: X+28, Y+13
Prize: X=3780, Y=8310

Button A: X+57, Y+17
Button B: X+32, Y+64
Prize: X=14053, Y=12989

Button A: X+69, Y+21
Button B: X+21, Y+56
Prize: X=4004, Y=15495

Button A: X+13, Y+57
Button B: X+51, Y+22
Prize: X=16160, Y=14572

Button A: X+14, Y+19
Button B: X+85, Y+13
Prize: X=7606, Y=2748

Button A: X+33, Y+73
Button B: X+54, Y+15
Prize: X=14495, Y=9636

Button A: X+27, Y+76
Button B: X+95, Y+32
Prize: X=6920, Y=3000

Button A: X+20, Y+47
Button B: X+30, Y+19
Prize: X=3110, Y=4476

Button A: X+31, Y+11
Button B: X+29, Y+48
Prize: X=6244, Y=11292

Button A: X+45, Y+53
Button B: X+97, Y+17
Prize: X=7032, Y=1864

Button A: X+18, Y+52
Button B: X+33, Y+14
Prize: X=19406, Y=16572

Button A: X+41, Y+53
Button B: X+91, Y+34
Prize: X=10865, Y=7187

Button A: X+12, Y+30
Button B: X+85, Y+66
Prize: X=13669, Y=16196

Button A: X+71, Y+18
Button B: X+13, Y+41
Prize: X=18103, Y=4939

Button A: X+14, Y+63
Button B: X+67, Y+11
Prize: X=6432, Y=8854

Button A: X+47, Y+91
Button B: X+53, Y+33
Prize: X=8859, Y=10887

Button A: X+48, Y+12
Button B: X+15, Y+87
Prize: X=2088, Y=3852

Button A: X+45, Y+28
Button B: X+27, Y+51
Prize: X=503, Y=12197

Button A: X+79, Y+61
Button B: X+33, Y+88
Prize: X=6318, Y=8317

Button A: X+72, Y+33
Button B: X+24, Y+41
Prize: X=4896, Y=3234

Button A: X+24, Y+63
Button B: X+65, Y+20
Prize: X=4749, Y=5688

Button A: X+96, Y+80
Button B: X+21, Y+92
Prize: X=3240, Y=3296

Button A: X+26, Y+49
Button B: X+60, Y+26
Prize: X=3526, Y=13443

Button A: X+50, Y+13
Button B: X+19, Y+43
Prize: X=17378, Y=4631

Button A: X+39, Y+19
Button B: X+29, Y+44
Prize: X=4495, Y=13885

Button A: X+60, Y+24
Button B: X+23, Y+58
Prize: X=319, Y=9930

Button A: X+22, Y+47
Button B: X+32, Y+12
Prize: X=11994, Y=16369

Button A: X+28, Y+21
Button B: X+18, Y+44
Prize: X=1734, Y=3100

Button A: X+79, Y+36
Button B: X+43, Y+89
Prize: X=9554, Y=8171

Button A: X+13, Y+49
Button B: X+40, Y+18
Prize: X=8820, Y=1722

Button A: X+98, Y+53
Button B: X+41, Y+80
Prize: X=9502, Y=9418

Button A: X+63, Y+35
Button B: X+11, Y+48
Prize: X=646, Y=6476

Button A: X+44, Y+91
Button B: X+63, Y+41
Prize: X=3484, Y=6134

Button A: X+89, Y+41
Button B: X+25, Y+63
Prize: X=4178, Y=5580

Button A: X+50, Y+14
Button B: X+56, Y+76
Prize: X=4798, Y=6350

Button A: X+40, Y+79
Button B: X+68, Y+39
Prize: X=7256, Y=7469

Button A: X+64, Y+22
Button B: X+27, Y+74
Prize: X=11428, Y=7610

Button A: X+15, Y+40
Button B: X+70, Y+34
Prize: X=8135, Y=14496

Button A: X+21, Y+82
Button B: X+61, Y+11
Prize: X=365, Y=3408

Button A: X+11, Y+62
Button B: X+66, Y+23
Prize: X=4797, Y=18596

Button A: X+40, Y+13
Button B: X+21, Y+49
Prize: X=19305, Y=17526

Button A: X+46, Y+26
Button B: X+13, Y+29
Prize: X=19340, Y=1244

Button A: X+40, Y+69
Button B: X+95, Y+26
Prize: X=8555, Y=4141

Button A: X+85, Y+40
Button B: X+15, Y+22
Prize: X=1960, Y=1012

Button A: X+71, Y+16
Button B: X+24, Y+87
Prize: X=7004, Y=7045

Button A: X+21, Y+47
Button B: X+77, Y+19
Prize: X=9296, Y=5932

Button A: X+19, Y+44
Button B: X+57, Y+39
Prize: X=3730, Y=17550

Button A: X+43, Y+18
Button B: X+36, Y+57
Prize: X=6741, Y=560

Button A: X+14, Y+61
Button B: X+70, Y+27
Prize: X=12156, Y=9208

Button A: X+65, Y+27
Button B: X+32, Y+70
Prize: X=10498, Y=9966

Button A: X+51, Y+14
Button B: X+19, Y+67
Prize: X=7451, Y=17265

Button A: X+33, Y+58
Button B: X+28, Y+11
Prize: X=11983, Y=3389

Button A: X+16, Y+96
Button B: X+91, Y+37
Prize: X=4868, Y=6812

Button A: X+27, Y+51
Button B: X+45, Y+14
Prize: X=3986, Y=4076

Button A: X+85, Y+31
Button B: X+55, Y+98
Prize: X=9550, Y=8705

Button A: X+31, Y+65
Button B: X+45, Y+18
Prize: X=7744, Y=17529

Button A: X+71, Y+79
Button B: X+15, Y+98
Prize: X=4053, Y=8006

Button A: X+82, Y+19
Button B: X+56, Y+71
Prize: X=4628, Y=5018

Button A: X+24, Y+77
Button B: X+98, Y+69
Prize: X=3954, Y=7532

Button A: X+41, Y+17
Button B: X+32, Y+61
Prize: X=3526, Y=17242

Button A: X+30, Y+81
Button B: X+40, Y+17
Prize: X=3440, Y=3100

Button A: X+28, Y+19
Button B: X+24, Y+80
Prize: X=4240, Y=7592

Button A: X+21, Y+58
Button B: X+78, Y+35
Prize: X=1218, Y=838

Button A: X+31, Y+52
Button B: X+41, Y+21
Prize: X=315, Y=17355

Button A: X+49, Y+16
Button B: X+13, Y+59
Prize: X=18203, Y=4190

Button A: X+93, Y+58
Button B: X+34, Y+68
Prize: X=5037, Y=4826

Button A: X+12, Y+21
Button B: X+77, Y+23
Prize: X=7438, Y=3406

Button A: X+17, Y+38
Button B: X+36, Y+12
Prize: X=14023, Y=19570

Button A: X+41, Y+20
Button B: X+13, Y+45
Prize: X=12692, Y=12660

Button A: X+33, Y+56
Button B: X+49, Y+18
Prize: X=6386, Y=18202

Button A: X+49, Y+14
Button B: X+16, Y+59
Prize: X=18649, Y=18798

Button A: X+71, Y+75
Button B: X+83, Y+14
Prize: X=6237, Y=6220

Button A: X+11, Y+71
Button B: X+43, Y+13
Prize: X=6580, Y=3400

Button A: X+59, Y+18
Button B: X+34, Y+75
Prize: X=16107, Y=6308

Button A: X+15, Y+44
Button B: X+61, Y+29
Prize: X=12387, Y=5353

Button A: X+51, Y+26
Button B: X+40, Y+67
Prize: X=15630, Y=6845

Button A: X+59, Y+22
Button B: X+62, Y+89
Prize: X=3619, Y=4380

Button A: X+14, Y+27
Button B: X+55, Y+30
Prize: X=6473, Y=5069

Button A: X+75, Y+13
Button B: X+17, Y+65
Prize: X=6400, Y=12236

Button A: X+16, Y+76
Button B: X+45, Y+28
Prize: X=3786, Y=5724

Button A: X+18, Y+58
Button B: X+76, Y+36
Prize: X=18338, Y=16978

Button A: X+61, Y+16
Button B: X+28, Y+63
Prize: X=16966, Y=3636

Button A: X+51, Y+29
Button B: X+21, Y+40
Prize: X=16031, Y=2166

Button A: X+48, Y+15
Button B: X+38, Y+69
Prize: X=5240, Y=14594

Button A: X+21, Y+66
Button B: X+65, Y+25
Prize: X=10512, Y=18802

Button A: X+51, Y+29
Button B: X+31, Y+60
Prize: X=8902, Y=15061

Button A: X+73, Y+11
Button B: X+12, Y+58
Prize: X=10144, Y=6524

Button A: X+33, Y+13
Button B: X+13, Y+64
Prize: X=15359, Y=12471

Button A: X+43, Y+22
Button B: X+25, Y+60
Prize: X=12175, Y=17320

Button A: X+18, Y+50
Button B: X+71, Y+41
Prize: X=16553, Y=13463

Button A: X+50, Y+17
Button B: X+24, Y+52
Prize: X=11480, Y=11116

Button A: X+57, Y+15
Button B: X+18, Y+43
Prize: X=8951, Y=14314

Button A: X+26, Y+54
Button B: X+38, Y+15
Prize: X=5416, Y=10628

Button A: X+17, Y+85
Button B: X+80, Y+72
Prize: X=5477, Y=6393

Button A: X+54, Y+97
Button B: X+80, Y+14
Prize: X=11264, Y=10376

Button A: X+53, Y+28
Button B: X+11, Y+26
Prize: X=1013, Y=1018

Button A: X+36, Y+70
Button B: X+54, Y+17
Prize: X=16964, Y=11094

Button A: X+12, Y+53
Button B: X+73, Y+38
Prize: X=8472, Y=7762

Button A: X+24, Y+59
Button B: X+85, Y+25
Prize: X=6433, Y=4593

Button A: X+39, Y+72
Button B: X+88, Y+21
Prize: X=2782, Y=3297

Button A: X+94, Y+27
Button B: X+63, Y+88
Prize: X=2833, Y=3540

Button A: X+39, Y+30
Button B: X+16, Y+96
Prize: X=3773, Y=10602

Button A: X+24, Y+57
Button B: X+73, Y+39
Prize: X=6423, Y=9389

Button A: X+45, Y+85
Button B: X+85, Y+14
Prize: X=8285, Y=6563

Button A: X+33, Y+99
Button B: X+84, Y+45
Prize: X=3630, Y=8613

Button A: X+66, Y+28
Button B: X+28, Y+64
Prize: X=7960, Y=11400

Button A: X+51, Y+18
Button B: X+14, Y+31
Prize: X=14492, Y=18596

Button A: X+13, Y+47
Button B: X+78, Y+21
Prize: X=653, Y=1802

Button A: X+16, Y+68
Button B: X+32, Y+28
Prize: X=736, Y=1832

Button A: X+58, Y+26
Button B: X+26, Y+60
Prize: X=1312, Y=16154

Button A: X+18, Y+58
Button B: X+64, Y+20
Prize: X=4330, Y=6026

Button A: X+52, Y+35
Button B: X+17, Y+39
Prize: X=17129, Y=8475

Button A: X+35, Y+18
Button B: X+22, Y+53
Prize: X=5559, Y=14388
`
  .trim()
  .split('\n\n')
  .map(parse);

console.log(fewestToken(test));
console.log(fewestToken(test, 10000000000000));
