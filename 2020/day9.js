function findWeakness (input) {
  for (let i = 25; i < input.length; i++) {
    if (!checksum(input[i], 2, input, i - 25, i)) return input[i]
  }
}

function breakEncrypt (input) {
  const weakness = findWeakness(input)
  let first = 0
  let last = 0
  let sum = input[0]
  while (first < input.length) {
    if (last < first) {
      last++
      sum += input[last]
    } else if (sum < weakness) {
      if (last < input.length - 1) {
        last++
        sum += input[last]
      } else {
        sum -= input[first]
        first++
      }
    } else if (sum > weakness) {
      sum -= input[first]
      first++
    } else {
      const list = input.slice(first, last + 1).sort((a, b) => a - b)
      return list[0] + list[list.length - 1]
    }
  }
}

function checksum (sum, n, input, start = 0, end = input.length) {
  if (n === 0) return sum === 0
  for (let i = start; i < end; i++) {
    const product = checksum(sum - input[i], n - 1, input, i + 1, end)
    if (product !== false) return true
  }
  return false
}

const test = `
33
12
43
4
19
48
21
13
29
34
20
24
25
40
28
31
38
2
50
11
44
49
42
16
41
46
54
35
6
15
8
47
10
22
17
60
19
12
13
14
18
28
20
25
21
23
27
39
24
16
26
29
40
30
37
31
33
43
32
34
44
41
49
35
36
52
61
53
42
76
45
50
46
47
48
55
93
80
67
89
142
69
74
75
70
149
71
77
78
81
242
111
88
87
91
94
155
95
119
137
188
136
162
138
139
140
146
164
221
172
148
159
215
228
168
175
182
229
278
305
340
214
370
277
273
275
282
310
302
288
286
321
568
307
631
357
845
343
350
612
389
598
643
535
561
620
552
662
548
885
557
570
678
574
593
671
859
664
985
1257
746
693
732
1877
924
937
1100
1083
1366
1105
1433
1122
1118
1131
1724
1127
1163
1320
1167
1769
1335
2179
1357
1425
1478
2183
1899
2855
2440
1861
2037
2205
2294
2227
2285
2438
3339
2451
2290
2487
2330
3493
2502
2760
4406
2692
2782
2835
2903
4819
3760
4665
6870
4714
4989
4264
8482
6247
4512
6595
4620
4741
4781
9770
4817
9406
5194
5262
5452
5474
10646
8425
5738
10011
9083
8024
9730
8978
8776
10441
10867
9132
9253
15427
9361
9401
9522
19417
10291
10079
10456
14535
14996
10926
11212
18339
14716
13762
16800
17002
19842
18029
19988
28418
18385
18493
37550
18614
18762
18883
18923
24238
20370
28297
32874
25461
22138
29419
24688
24974
33209
30764
44384
33802
35031
55019
36414
50556
50435
37147
37416
37497
49526
37685
47112
39293
49212
45058
74477
46826
70949
82555
84358
119702
70032
81800
80089
68833
70216
71445
74099
73911
74563
74644
75182
194346
76790
82743
109130
119157
143310
91884
113891
142394
115659
185920
184107
138865
139049
142932
149281
146008
140278
141661
146627
167066
151353
201014
225675
229370
430384
243856
174627
205775
230749
207543
241165
229550
254524
254708
277914
279143
288940
372302
281939
295908
448708
286905
293014
541613
654241
650216
403997
380402
1191829
382170
664109
404177
460299
517654
437093
484074
557057
543464
572157
568083
561082
568844
579919
678078
1078736
667307
669075
673416
762572
1077593
784399
1482733
784579
786347
841270
864476
1106168
921167
954747
980557
1045156
1358504
2051577
1129165
1129926
1141001
1148763
1247226
1336382
1537892
1340723
1342491
1435988
1546971
1568978
1570746
2278689
1707514
1627617
1705746
2062168
2527528
2175082
2025713
2676136
2270166
2259091
2465547
2270927
2711747
4303753
3963516
3046469
3063605
2968340
2683214
4851218
4982674
5305560
3274724
3198363
3333363
3335131
3886708
3731459
4087881
6358047
4200795
4491260
4529257
4530018
7459600
4736474
4954141
7423012
5651554
6016577
6379832
5746819
5881577
6609855
6473087
9936815
9266492
6608087
12464855
12413741
7066590
15283069
7819340
8288676
8692055
9484159
9265731
9059275
10970718
10483293
14918046
10605695
11398373
21524130
11628396
12126651
16332321
12354664
13081174
13539677
14885930
15873818
18543434
17085071
15355266
15758645
16108016
16511395
16980731
17751330
28113309
18325006
22234091
21454011
32958889
22004068
22732346
33580662
28866059
31624608
24481315
25435838
25894341
30061905
28425607
30241196
36868440
38745486
31113911
55726217
31866661
64072800
41947233
34732061
36076336
57518949
39779017
43458079
44186357
46485383
47213661
50375656
68312723
92794038
70020213
59213376
96081816
54319948
58487512
58666803
80616852
74511078
62980572
67942997
78023569
78190140
70808397
76679294
75855353
90154673
83237096
113533324
121481648
90671740
97589317
101533609
109589032
112807460
141004141
172100395
112986751
208947138
161260665
223015257
121647375
187612601
235180699
147487691
168344813
204205064
146663750
152534647
159092449
166010026
210576068
312673776
188261057
192205349
248197359
199122926
369668517
222396492
259650501
253990892
234634126
395894791
464566960
307924415
268311125
289992188
452402423
294151441
572324277
363297513
460516474
516508484
311627096
354271083
387383983
432972560
470593851
617288405
433757052
630528917
608261975
549642689
457030618
553801942
983399741
502945251
558303313
562462566
648422524
584143629
601619284
699011079
879805997
530627549
665898179
1202224466
741655066
928915501
787243643
890787670
1133474168
904350903
1324544722
1209881259
959975869
987658167
1006673307
1010832560
1033572800
1061248564
1087088880
1088930862
1093090115
1114771178
1132246833
1196525728
1453141822
1272282615
1317871192
1938180794
1691594546
1528898709
1678031313
1902014821
3148062053
1993548669
1864326772
2017505867
1966649176
1947634036
1994331474
2094821364
2072081124
2257774292
2148337444
2176019742
3350864407
2311296906
3639228582
2328772561
2771013014
2846769901
3009465738
3182197964
3623720073
3206930022
3522447378
3542358085
3766341593
3811960808
4205408328
3830975948
3914283212
3941965510
6531913116
4066412598
5158066807
4220418568
4433794034
4324357186
6140733369
5099785575
4640069467
6658730709
5175542462
6389127986
5856235639
6191663702
7484323595
6729377400
11887444207
7608770683
7308699678
7597317541
7642936756
9739855042
8266322696
7856248722
8654212602
11704742163
8286831166
11369446867
8544775754
9815611929
10516020888
10275328037
10496305106
11029197453
14478494868
11031778101
12245363625
15340572317
12921041102
14213700995
14038077078
14906017219
14917470361
14951636434
15240254297
18102443095
21304525490
18360387683
16143079888
19316028619
16831606920
18562159203
18820103791
19041080860
25067274531
22520691662
29378649395
21525502559
27172277341
23277141726
48476802831
25166404727
26959118180
43416726473
28251778073
40018910965
29823487580
29869106795
30191890731
32974686808
34245522983
35393766123
34503467571
34705239091
38136132410
35872687780
41082850865
47292858933
40566583419
44046194221
46691907286
44802644285
69208706662
48443546453
55035511522
52125522907
53418182800
60060997526
80196410408
58075265653
91049952461
78291717204
62843793603
64897129822
67220209791
68950762074
69897233694
78549661792
78702715829
104863641811
76439271199
81649434284
91339053154
84612777640
95135453739
145390033273
96928167192
101861729253
100569069360
125295475444
105543705707
185740116115
118136263179
122972395475
131794555677
127740923425
130064003394
132117339613
147500423866
136170971865
138847995768
157252377621
220783749505
155141987028
268288311478
161052048839
365216478670
212353701065
179748231379
497011034347
273278250207
207405434960
255359478838
206112775067
275388640800
223679968886
270472819341
402267375018
250713318900
767483853688
257804926819
387476818451
270965335381
275018967633
318304426460
296100373389
312394364649
428420237235
316194035867
340800280218
367164823906
506072797738
703808878035
385861006446
413518210027
481501415867
1153344860134
499068609686
429792743953
474393287786
481484895705
1197276597641
508518245719
664231528927
699385572616
528770262200
1022113304495
615819247851
571119341022
634498462327
608494738038
780683033933
656994316085
887911497813
726661286664
1232734084402
1029337457878
799379216473
884929616132
928861353639
904186031739
1661863105853
911277639658
1393447861851
1235179532383
1457631615839
1117012983757
1896965613329
1351802374955
1297780627686
1099889603222
1179614079060
2332623687624
1630847318403
1899268819695
1880572637155
1383655602749
1544905813898
1526040503137
1611590902796
1710656856131
1684308832605
1703565248212
1789115647871
2649583002641
1815463671397
2011167242880
3156496716694
2296627062817
2414793611443
3199119274146
2705654582197
2279503682282
5098388093841
2397670230908
2483545205971
2883179327272
2909696105886
3499772504002
2928561416647
4009585709108
5495746336963
3070946317035
4175623505778
3295899735401
5571290328137
5280849558180
3492680896083
9456473063958
6205595841287
3826630914277
7496058324749
5179806390089
4694297293725
6590417117221
4881215436879
5189199788168
4677173913190
5326231647555
5307366336794
5366724533243
5792875433158
7990197029126
5999507733682
6224461152048
6366846052436
9276542158322
11505310710228
8475706125490
6788580631484
11871266675401
15264286756974
9859526948519
15823319116394
10020528941280
8503804827467
9371471206915
9558389350069
9575512730604
14697702854470
9866373701358
9984540249984
10003405560745
10633597984349
15370978940597
16002913294427
13155426683920
13013041783532
23846685066087
12591307204484
15292385458951
24568927617273
16160051838399
19987945810729
16346969981553
17875276034382
20618138234333
19725900649877
19424763051427
18062194177536
18079317558071
18946983937519
19441886431962
20209110714953
22594712765229
19850913951342
36437992270571
20637003545094
23224905188833
28751359042883
29158339978347
33364537398873
25604348988016
27883692663435
35816212393317
31452437297350
32507021819952
37504080609498
34409164159089
34222246015935
35937470211918
40362904194971
55258098825279
37913108128878
73320293002815
37026301495590
38388870369481
43075819140175
59025873914575
48520696208529
40487917496436
43861908733927
46241352533110
60610777275697
63993219357497
70159716227853
53488041651451
57056786285366
59336129960785
70038458409252
63959459117302
66729267835887
68631410175024
70346634371007
129372508285582
72963771707508
75415171865071
74939409624468
83267654028700
`.trim().split('\n').map(Number)

console.log(findWeakness(test))
console.log(breakEncrypt(test))