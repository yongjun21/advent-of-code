const assert = require('assert')

function countDots (dots, folds) {
  const [folded] = applyFold(dots, folds)
  return folded.reduce((sum, v) => sum + v, 0)
}

function printFolded (dots, fold) {
  const [folded, dim] = applyFold(dots, folds)
  for (let i = 0; i < dim[0] * dim[1]; i += dim[0]) {
    const line = [...folded.slice(i, i + dim[0]).values()].map(v => v ? 'X' : ' ').join('')
    console.log(line)
  }
}

function applyFold (dots, folds) {
  const maxCoord = [0, 0]
  dots.forEach(coord => {
    if (coord[0] > maxCoord[0]) maxCoord[0] = coord[0]
    if (coord[1] > maxCoord[1]) maxCoord[1] = coord[1]
  })

  let state = [...dots]

  folds.forEach(line => {
    const axis = line.charAt(11) === 'x' ? 0 : 1
    const value = Number(line.slice(13))
    assert(maxCoord[axis] >= value)

    maxCoord[axis] = value

    const updatedState = []
    state.forEach(coord => {
      const transformed = [...coord]
      if (coord[0] > maxCoord[0]) {
        transformed[0] = maxCoord[0] - (coord[0] - maxCoord[0])
      }
      if (coord[1] > maxCoord[1]) {
        transformed[1] = maxCoord[1] - (coord[1] - maxCoord[1])
      }
      updatedState.push(transformed)
    })
    state = updatedState
  })

  const dim = [maxCoord[0] + 1, maxCoord[1] + 1]
  const reduced = new Uint8Array(dim[0] * dim[1])
  state.forEach(coord => {
    reduced[coord[0] + coord[1] * dim[0]] = 1
  })

  return [reduced, dim]
}

const dots = `
527,872
94,740
502,586
33,514
349,784
1292,133
733,623
305,336
108,628
1086,396
845,128
674,761
768,317
783,154
731,697
803,844
865,96
1263,567
1141,141
1218,644
1115,429
951,373
748,326
1088,422
259,673
885,885
150,732
181,19
182,581
1130,838
647,386
53,140
27,726
1198,105
219,476
545,779
234,528
1042,145
422,852
683,726
636,40
140,590
415,824
415,637
238,478
0,347
1277,380
1076,366
984,112
808,787
321,480
576,707
999,810
1283,392
604,606
610,724
107,487
657,497
258,378
392,224
1044,498
53,754
706,606
1191,753
661,256
895,637
1015,373
455,808
825,753
929,835
581,205
1236,30
343,74
207,813
547,866
1005,558
113,420
445,4
562,326
924,593
209,621
1078,42
1265,798
923,408
1082,808
910,889
850,408
1277,268
984,809
1191,813
295,541
108,826
705,698
97,666
878,33
1245,240
1257,140
1001,416
252,478
139,51
75,732
925,750
388,502
721,703
509,254
808,532
478,386
349,299
328,85
463,210
254,126
835,281
895,569
850,155
513,782
195,465
1066,155
119,529
355,826
1078,68
176,350
459,465
1077,364
47,567
674,40
169,141
119,305
541,485
1009,642
1212,894
537,544
674,754
517,616
25,38
5,32
191,572
700,276
1004,891
492,547
701,516
65,45
319,60
1071,325
621,575
1131,834
185,560
693,571
441,140
157,533
527,32
915,221
1212,780
1131,501
463,684
1169,112
1299,269
832,350
555,733
1115,476
432,422
266,310
835,393
105,277
820,499
967,820
63,894
561,754
301,642
668,233
182,600
801,640
502,532
1134,554
546,68
11,625
373,98
1082,114
654,771
763,28
92,102
713,74
869,409
855,360
1277,864
1083,875
604,288
924,301
11,269
841,511
1037,140
868,670
759,486
604,222
917,464
1034,512
806,126
1004,865
677,670
763,866
1305,862
681,728
1251,408
955,390
224,119
465,598
87,773
442,670
492,558
1019,406
929,59
513,560
1146,323
947,646
305,224
656,632
952,520
639,82
1200,99
984,206
951,93
1283,502
150,574
825,164
432,413
965,579
436,740
445,778
840,254
1310,547
93,759
299,726
761,725
793,558
1202,826
1173,822
951,476
415,40
423,226
405,175
813,529
499,451
254,630
845,369
73,653
234,814
855,808
465,318
12,162
403,284
730,478
907,284
224,396
301,520
186,590
551,486
832,116
773,544
956,362
273,140
234,379
828,182
306,865
1193,574
176,554
1175,810
711,617
1015,541
928,644
426,808
586,826
535,753
1173,72
301,597
311,532
233,493
838,28
174,227
219,110
597,841
884,780
271,102
65,240
354,362
932,522
652,833
720,894
895,824
371,779
957,374
293,799
169,276
791,532
580,416
711,726
408,462
239,396
1077,135
754,360
609,322
880,119
497,500
289,323
875,784
239,817
455,154
137,72
1101,768
212,126
445,452
1029,546
108,68
610,170
579,162
295,521
1124,369
797,334
872,347
137,822
1202,266
649,376
984,645
1280,150
102,870
485,164
435,476
924,28
1289,819
760,525
483,3
1029,348
1255,168
276,382
808,219
108,714
1295,596
1237,395
556,222
996,232
440,341
30,150
349,336
422,826
113,754
801,621
811,239
15,364
748,568
924,749
661,638
45,798
281,546
228,114
359,476
929,588
1119,210
470,254
415,257
70,698
649,862
999,74
711,700
381,140
1305,704
313,467
70,366
475,393
1011,826
945,634
621,366
1191,305
288,728
346,700
513,112
863,81
883,161
229,493
507,396
383,252
579,732
309,864
324,425
1163,501
268,145
1094,547
579,396
438,99
157,365
1260,606
373,49
266,502
492,150
1310,632
381,59
499,655
838,313
447,813
420,515
890,515
961,670
855,154
199,422
927,102
1044,502
1128,742
408,581
1223,773
254,217
764,628
325,161
902,581
1017,416
887,226
1265,96
1071,396
535,141
1265,123
45,330
562,120
706,64
119,813
1205,277
209,871
753,661
832,126
53,280
93,588
731,396
515,619
473,173
541,409
326,533
1163,53
1101,452
1285,297
754,672
455,740
472,600
1289,147
960,640
855,534
311,74
1009,252
504,126
53,166
1257,754
836,56
758,422
1173,476
585,194
465,185
830,73
1007,611
633,670
68,516
1310,85
955,68
689,319
1283,726
513,334
426,86
669,427
1049,586
1280,744
1125,831
1292,854
663,386
1266,618
748,341
1148,547
627,420
1305,302
268,637
746,96
1252,705
232,42
1155,239
281,378
351,611
944,789
731,249
1004,193
666,422
147,277
639,805
991,834
883,875
713,841
33,127
924,252
835,255
1173,542
355,68
455,360
937,116
475,501
549,169
835,396
18,488
400,406
523,877
556,332
222,33
627,392
301,710
748,553
818,150
545,115
584,196
55,168
870,341
305,558
634,451
601,614
45,123
254,406
393,308
1101,871
131,93
970,662
801,478
415,817
1119,322
550,77
1258,486
1251,486
224,567
460,155
1170,590
238,416
358,598
835,501
786,774
353,168
835,57
855,740
507,844
811,655
179,639
1064,761
633,784
1029,378
119,753
326,85
599,866
1021,858
1082,780
1076,814
1031,416
385,750
345,579
233,530
1078,490
791,154
145,142
1056,453
922,215
283,331
393,464
1066,739
117,621
797,560
609,798
705,196
982,137
604,560
957,168
627,502
557,681
1128,600
604,334
793,542
445,871
386,642
621,268
1280,374
231,226
191,322
445,96
845,576
1305,592
218,42
729,732
435,110
445,116
181,478
919,558
525,402
465,766
806,574
55,277
731,809
542,553
753,681
850,632
1237,284
25,616
1265,330
229,885
759,72
276,512
472,581
1233,623
1216,740
420,528
1071,369
1265,378
556,534
373,826
917,430
599,617
475,709
1310,123
957,726
191,292
701,322
295,373
499,443
65,849
472,742
682,793
562,568
605,698
765,779
865,173
711,476
837,875
599,476
597,302
530,56
730,416
269,750
1198,553
726,196
455,472
524,344
683,882
1064,313
431,502
1130,607
991,123
361,543
507,820
628,793
1173,128
510,537
65,654
629,194
432,33
827,891
1114,605
182,742
326,137
1058,478
962,417
947,406
1125,560
738,267
633,672
584,698
355,56
227,19
845,318
396,378
676,451
72,574
400,5
542,341
1163,165
1098,126
639,530
436,404
910,630
353,642
938,612
884,114
832,544
1298,680
1011,378
97,213
306,701
12,680
838,581
1246,558
1064,252
937,49
1108,504
865,350
174,362
1094,347
1237,205
269,144
325,733
1235,732
937,68
1175,740
803,820
604,64
601,140
402,478
1260,222
468,590
246,194
305,523
519,292
1138,264
319,834
127,470
415,854
299,378
959,283
1223,413
1081,885
671,162
186,369
311,362
1213,666
1131,863
1212,114
649,638
686,374
723,445
345,315
565,823
30,520
348,254
465,576
801,721
75,681
214,117
910,453
1305,32
103,408
599,194
580,478
276,672
1138,712
689,864
233,759
18,133
1059,661
970,232
962,254
381,588
922,663
301,252
1242,154
519,602
1009,374
773,423
117,273
597,820
556,0
246,313
1015,521
502,308
914,378
82,627
845,525
902,462
372,612
918,808
455,870
1268,616
517,542
609,378
1115,465
874,42
1094,795
895,376
1115,866
1086,119
656,470
629,408
1284,101
105,617
1266,276
654,470
714,136
392,808
918,224
1015,821
755,161
1021,323
1056,217
1280,520
87,481
731,162
1163,396
244,155
1131,498
137,542
937,826
681,821
`.trim().split('\n').map(line => line.split(',').map(Number))

const folds = `
fold along x=655
fold along y=447
fold along x=327
fold along y=223
fold along x=163
fold along y=111
fold along x=81
fold along y=55
fold along x=40
fold along y=27
fold along y=13
fold along y=6
`.trim().split('\n')

console.log(countDots(dots, folds.slice(0, 1)))
printFolded(dots, folds)