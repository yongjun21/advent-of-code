const { getPermutations } = require('../helpers')

const BASE_SEQUENCE = 'abcdefg'
const BASE_PATTERNS = [
  'abcefg',
  'cf',
  'acdeg',
  'acdfg',
  'bcdf',
  'abdfg',
  'abdefg',
  'acf',
  'abcdefg',
  'abcdfg'
]

const PERMUTATIONS = getPermutations(BASE_SEQUENCE.split('')).map(ordered => {
  const mapping = new Map()
  BASE_SEQUENCE.split('').forEach((before, i) => {
    const after = ordered[i]
    mapping.set(before, after)
  })

  return BASE_PATTERNS.map(pattern =>
    pattern
      .split('')
      .map(before => mapping.get(before))
      .sort()
      .join('')
  )
})

function count1478 (input) {
  const count = new Array(10).fill(0)
  input.forEach(row => {
    const decoded = decode(row)
    decoded.forEach(v => {
      count[v]++
    })
  })
  return count[1] + count[4] + count[7] + count[8]
}

function sumOutput (input) {
  let sum = 0
  input.forEach(row => {
    const decoded = decode(row)
    sum += Number(decoded.join(''))
  })
  return sum
}

function decode ([input, output]) {
  const matched = PERMUTATIONS.find(permutation => permutation.every(pattern => input.includes(pattern)))
  return output.map(pattern => matched.indexOf(pattern))
}

function parse (line) {
  return line
    .split(' | ')
    .map(part => part.split(' ').map(token => token.split('').sort().join('')))
}

const test = `
gbcefa eac acfbg ae dcabfg begcdaf ecgba fgaedc beaf gcbde | cbgfa gedcb fgecab fbagdc
fb adceb febagd edgafcb cbfega gecadf dgfb dfeag baefd baf | gbdf gbfd fgebac dfega
dgabec cfgeb cfb cefd cdabfg gbdce fc begdfc gfbea febacdg | bcfdaeg cf fc gecabdf
gadfce acdgf bgaec gbfdca acgbd dceagfb agfdbe dbfc gbd bd | dgb cbadg cagdb cfbd
edcbafg ab ecfdb dacfeg bcag aeb fgaebd bfecga eacgf bcaef | ba eab cdgefa gcab
gbdcfea adfcge ebc be fegcbd ecfbad efgcd ebdg gacfb fcebg | cbgefd defcg cbefdg eafgcdb
fbace afdb gafbdce bd acbedf ecdabg fgeabc edgfc befcd dcb | ecdfb fcegab badgefc dafb
dbgcf fgadce aefcdb fe baef aegcbd fec aedbc bfced agefbdc | cfgbdea fe abecd efc
fabec efg aegd bafdg abfge egfdcb eg gbfecad bdafcg gbdefa | cegfbd efg fgabd bedgacf
dbcfeg ad edgfc egacfd bacdfg febca cefad adf eadg fdcebga | agdcbfe cfead fcdea ad
eg edg cgaedbf egbfad adcfbe begcd bcade bgfdc gacebd egac | aceg eg ge ged
gaecdb dgaeb ecagb egbafc cafgebd cead efdbgc agbfd de edg | ed daebg egd gacfbe
bag degfa bcadgef gcfb bg fgdba ecbfda bdcgfa abfcd gedcab | gafdb edgaf bag edcagfb
eb egafcb bafcd acgebfd efcdga cbegfd bega cgeaf ebf cbafe | fgcae eabg fdbcge agbe
fdcabeg cbadge cfgdb ebaf agdfec bac bfadce bdcaf efcda ba | ba bgeadfc cgdbea ab
deagcf ac cebfg gedfba cadb caf gadbefc dbgaf facbg dcagfb | ac gcdbafe ca fca
cdgef be gfbed gdbaf cagdeb fgcbdea gdfbca abef afdegb dbe | bed cgdebfa abdegf bfea
geafdb afc dcgfa daefcgb adgfb egfcd ca bfeacd bdgcaf cgba | gcba ca bgdeaf afbdg
fgcdae bdceg bfe bacf afcedgb cbedf afcde bf edbcaf ebdafg | cdfea bagdef bcefd cdfae
efgabd efgbd edab bd feagd ebgcf acdegf gecbdaf gfdacb dgb | bgd bdcafg bgd dbafcg
aedcg dfbaceg egd efdca afeg bacedf ge dbefgc cabgd fdaecg | eg dge agfdec deg
fge abefgd acdef eg fgdab adgbfc egfad dcbegf bgae bcdgfae | bfdgcea fge fegbda cgdfba
becgda efdgac ab bcefd fbaged ebgdcaf bae cabg cgdea ebadc | fbgade eab efdcga egafdb
cdfeb badgec acbfed bafcd efdbgca cde gbfed ce acef cagdfb | dbefc dbcef bfacd ce
aefg gabced efgdb dgfbc agfedb egb ecdabf abfde gaecbdf ge | ge dabgef bdfae dbefg
cedga egbdfa dge dgafbec gface dcabgf ed adgcb becd adbgec | abgcd bcgda dceb fadegb
fdebag caf aecgdbf fdgc fc cdefa dgacef edfag fegbac adceb | fc afedgb gfacbe afbdeg
egacf adfge fbgcea gacb ca caf aegdcfb fcbeg bdcefa edgfbc | ac dbgfaec fgaec agfdbec
ceagdbf egbcdf fa bgfcae afbd abedgf gaefd edfbg aef adcge | edgfa fea gfdbe bgfeca
cfeg fcbdga ebagcd bgf ebacg afbgce gf fdgeacb fbeag aedfb | gcfe abdegc egfc bcagfe
begdfca fdeba daecfg bfg fabeg fegca efcbdg gb bgac gbface | agbc badef aefbd fcbdega
aecfgb bac gfaedbc fedbac edcfag fcdb dacef cb ebadc eagdb | adbfegc edbga eafcd bca
fdgbaec cdfbag bfaegc ae aefcdb afe eadcf fdcba bdae cgefd | gcfde cafebg aefgbc dafbc
fgbdcea bf ebfgca fgb efbd dfcga ebagd dbfega cabegd fabgd | dcafg bedf fdbe befd
abcge cgde cbagf fdeacb egdba dfbgea ce egbdcfa bdagce cae | daefbc bedga egadb decg
dbcgefa gf fabdc agbecf gcfad afbcdg ceadg bfgd cdfbae gcf | gf bfdac dbgf gf
cfbedag cbfgad be eabcgd baec cgdab fbgeda gbedc bde cgdef | baec gdacb afbcgd abegdc
gbeac gbaced faged dab gcafeb db deagb eagdbcf abdgfc bedc | feadcgb db bdec cgeabfd
becagf facegd cdaeb dag gd cfabdg bdcag bgdf abgfc dcbgefa | gd gadbc gdbf cbagd
gde cdgea bfdgce aefg cbdga aecgdf cdafe faedbc dcgbfea eg | agbdc ge ged cfead
ba eacbd ebgcd eadcf dba dcbfea bafc agedfc defagbc bfgaed | ba edcgb afbdec cadgebf
dgfcbea bafgd dbfeag cdfab gf dfg egdcba gaebd gefb gdceaf | deagb egdacfb bfge fcdgae
cbadfg fgcade edgba dagbf agf gecbdaf af fdgbc bdcgef fcba | dfcbge bfgdc acfb fa
be febdc edfcbg fgeb ceadgb dface fgbdc bacdfg edb cfdageb | eb faedc gbef gcbdfea
bgcedaf gafcd fgade afc aedfbg ac fcaedg ecbfda cdbgf egca | fgdbae fcgad fac fca
cbeadf bac fegab cb cebgfda acfegd cafbe acdfe dcbe cadfbg | bc fgbdaec fedac gefba
cdefb dfcbge cdaef ad egacdb fadceb eagcf aed ebcfgad dabf | edbagc cfbdea fbda edbcf
cdbfgae cgedb fdgbe egafb dabfge df fbad cafdge edf abgecf | fabd bfdgae daegfc faegbcd
acgefbd agbf aefbc egbafc bef fdeacg dcefbg bdcea acegf fb | fb efdacg fb agbf
bgdace aegbdcf gabfe afdg feacbg cbdef ad eadfb badefg dba | da da bfgae adfg
daegc dgebaf aebgf ecagfbd fbde bda db abfgec abcgdf agebd | bad bad fgabde bd
cgabe gafed bedc aedbg bgaecf bd ebgdca cabfdeg gdb bfcgda | ebagdc bd ecdb abedfgc
bgfde fdceagb fec gdceab acfg cgefb bgcae becafd cfbgae cf | cf fec gfac gfbdeac
fb bcdgae cdfae dbage bef dfebga bafde bgdf cgfbeda gbeacf | gdbf fb bfdaeg fegabc
be gbfe dbfce gbfdca edb gbdfc eagdcb edfac cgabedf dgcbef | cfgabed aecdgb fgeb fgcbad
cabfd abfdeg abcfeg fbeac daec afd aebcdf da fdgcb gabfdce | adcefb dfacb adf agefbd
bagdfe efac ebcgd eadcbf cgfabd bfe fe cegdfab cdbaf fbced | bfe edfbc dgefbca befdc
bcd bfecg adce cd fgcabd fgaedcb abedfg cgbed bcgade egdba | bfdgcea caed deacbg dbc
fbadgc afecd dbgfaec adbfeg agdecf fac gaec cebdf fgead ca | cfead ca befcd geabfd
gaebcd gfaebc ga egacd gfbced faced agc cgebd dagb fcdageb | dbcge bdeagfc cefdbag gca
cb fegac fgbac gacbfd acebdf cab abfdg fdebga cgdb fbeacdg | bc cfgabd acgfb afegc
gfbda afec fe bdegca afcbeg ebgca abefg efb gcedbf bagfced | efdcbg agbef ef face
fecgba cgdefab agcedb ce dcae cedgb egbad ecb dbcfg abegfd | ce gdbae ceb dbafeg
edacg fdbace cb bfdga dcagb cdbgfa bfcg abc fbcgaed gfabed | fcgb gcdfba cab adbcef
bgefcad becfda afdeg afdceg be fabdge ebd gcbad deabg fgeb | edb bde bcefda gcedfa
gaecdf dcag gfa gcfed cabef gcefa ga dcbgef bfdgaec bgdeaf | cdga cfged afg ag
bc gbdace gcbaf gfcad bcgaef bca ecfb dcfbgea gafeb fgadbe | cbef cfgab bc gabfc
aef dcfgbe cfbeag dacbe cgfa fa egcdafb febca edbagf fgebc | dabec fcag afgc fbcage
deb bgcda bcade dcfage fdgbce ceagbdf afbe dabfce afedc be | deb ebdfagc fabedc fgbecd
caebd dafceg afdb fea ecafdb egdbacf fa cdbgea cbeaf bfcge | befdac ecbad fecab cegbda
baegf gcdefb ea dgcbaef efa febdag dbegf fgbca aebd aecfgd | fegab ae gbdef gcbedaf
ecdbgf cga dgbae bgefc cfaegd ecfagb egcba ca dabfgce bcfa | gcdfae dbcfeg acgbe bgecf
bdacfe gedfcba bgdfca dgf edgc becgdf eabfg bcdef gd dbgef | cged gfdacb cegd abcedf
gcba gefcdba fac gfadeb dgfac dbfcga gdbaf dacbef ac cegfd | bdceagf fgdebac bgca gfcde
dgfabc gbfad gac cfgb edagbfc gdcaf dbcaeg badfeg cdaef gc | dgabf fbdag cg gc
eagbc efbgad afe dceafbg bafgdc afbdg fageb fe gdfe fdabec | bdgaf bfeag fe eagbdf
fbd cbefga dcba feabd db egdaf afedgcb dbecgf bfcea efdcba | bcad bcefga db fbdae
gafeb ecfdabg faebdc dgfa fg cgeba bfdegc eabfd dbgfae gfe | bcgdfe dfga agebf dfga
cdfgeb cb cbea bgdaf cfgba egfcba egacf fgdceab bgc caegfd | dacefgb dfgcae gadefc bgc
fgcbead feagb bdceaf gacb abgfce cbefa eag fdbge ag afdceg | bgca dfaecb gabc cabg
ebcfd ecfgd fbae cgfadb be feadbgc ecb fecbad cbdega cdabf | be efba aefb eb
egafc ed agcfbed fbgeac dfge egcdfa egbcad eda daecf cdfba | bfdac eda aegcf gcfeba
afegd geba cgfebd gfe ge gdbcaef badfg badcgf ebdfag cdaef | faegd gbecfd gef fbgad
edacgb cade cdagfb gbeadf acfegbd egd adcgb cdgbe bfgce de | gdcebfa dge abdcg cafdgb
adge efgac dfacg edafgc becdaf eafgbc gfbedac dcgbf ad acd | fbacdeg ad adeg beafdgc
dfgc bgcde bacdef ebcgfa ecfgb dfgcbae gedba cd gdfbce edc | egfbcd agcefb fbagce aegdbcf
ecgfba dagebfc gfbd cefda fcg bgacde gdcab gf gbdfca gfcda | gbadec dbacge fg gdfcaeb
cbadgef gafed eb bdfe dgaecf cbagf egb eabgf degcab defbag | agfed acgbdef egfda gadfbe
abdfgec afgeb gd ceadbf gde adebg caebd efgacd cedgba bdcg | febadcg bcdg gdbc geacdf
gafebc gfca gcbadef abdcge ecf aefbc dbeaf cgbea fc egfbcd | bdfae cgaf bcadeg cf
bcefagd decbfa cgfad fgdb gdeabc cfagbd cagef gd dcbaf dgc | acgbde afbedc edbacg cgd
bgacfd fbcgaed dacbf gadcb aegbcd cf fbaed gfac bcf fgbecd | fbdac bgecfd dcgab fc
cdafeg cb ecdb eabgfcd bdagcf dceaf dfbeac febga efcab abc | bc cfgdeab cb cb
bdcaef fcage gabce faegdb fc cfa cgdf gdfcae agbfecd geadf | cf fdgbeca cgbdeaf eafdbg
cedfab acdg faedcbg cae fceag gecfd ac afgeb fadegc fbcdeg | ca cdegf ac cae
feg bfgade ge gfabce ceafg gfebcad feacd gdfcab bceg agcbf | fgcabe eg dabgefc egf
gbeacf edbgc bdg dfabge gd dacebg aecgb cbdef dcbfgea dcag | becgafd edgcb egdbfa afdgbce
gafbc gecdf gdacf adf dfbage cgebfd fegdca acde ad defbcag | ecad ad adf agdcf
fdebca bea caef aebgdcf dabef cgedba gfadb cdbfe gebdfc ae | ea ea gbadf dgebacf
ef efdc defagb cabdef cbfadeg bdcea afe bcefa cfagb cedagb | dfec acefb ef caedbfg
gade adefcg bcfae fedgc fad fadec cdfgabe ad dabgfc dcgebf | daegcfb dgae da decbfga
facgd geadb cae cbge acebgd ce ebdfgca gceda fbgead efadbc | ebcg egbc cbfdae adegb
agecbd feabcd afecg df dbeca adebgfc cfbd afdegb edacf fde | aefgc fadebc dcbf fde
gce cdega bcadge eg acbfed cabde dcagf edcgbaf egba gfcbed | bdgeca daebc dbcae ceg
gcaf ecfbag egcdfab badegc bfcea bcega egfcbd cfb cf aedbf | fbc gfbecd fc cafg
becdga beg ecdafg gbfec cgafb fbed dacfegb be cebdfg gecdf | afcged agefdc egcadf fbde
eacd cfe efdgabc acedfg ce dfcge fgbcd gcaebf dfeag dfeagb | adec fgced cef ec
adecbfg gfa cfgbe ag afced cfdeba cafeg adge fdgcab cegafd | gacdbf gecbadf eagd efacd
cfbade dfbegc dbefc gbd adfgc cebg dgfcb dgcaebf gb afgebd | bg cfagd cedbf gb
fbca cgebdf cb acedfg dgeba dcb acedb fcade ebdgfca eadbcf | deagb cb cbd eadbg
bdgac cgf bgcefa acgfdb fc dgfae dfcag aegbdc abcgedf fbdc | fcg fcg bdfc fgc
efadbg adbfc ac acbedgf ecbdga fcdgb aebfdc cfea adefb cda | cad febda dgeafb dfcabe
fdcab ecfbga gcafbd daef ef bcfed efb afcbde dbecg cadegfb | abdefc dbgce gdfbace bef
ecgfb gbda gafde baegfd gfbea bae ba edfcab adcgef bdafegc | gacdfe afcged edbacf adebcf
aebgdfc gdfe beg becgd dacbfe defgbc ebcgaf ge fdbce gacdb | ecgfadb egb abgdc gefdcb
eacgdf de fbdac bfgace aecbgfd dbfecg afceg dceaf ecd dgae | cgaef efacdg cagfebd cefga
bgde db dbf afbed fgedba fadgce decabfg faceb adefg fabcdg | bagfdc bd dfb afdbge
acbgdfe fgecad bdefa geacbd ab aeb bgaf bedfc feagd dgefab | dagcfbe bfade gbedac ab
gafcbd ecgfb acedbg gbf abcegf gf gebac bcfed cdbfgea faeg | abegfdc feag gbf geadcb
fcbea da edbcaf cedfg cdfea dafb gabced eafbcg cdeafbg acd | cad fabd acedf fcgbea
fgc cg afegd egac facbedg gdcef efbgda efgdac bafdcg fdcbe | gfc cfg decbf gfc
dfabcg gdbecf dgfea begfa egd cead dgaefc fadegcb cgfda ed | deg cgfda de gde
gbedc gdbcfa fb bcafeg bcf egdfca agbdcef gfbdc dfab gafdc | adbf fadgbc gdfac dfba
baecgfd fed abedcg fdabeg egacdf gcefb dbgfe bfda deabg df | bcgdafe df df dgaebc
cedabfg badfe cfgdae gcea fcdeg gbcefd eadgf cbdagf dag ag | bcadgf gfdea fdbecg fedab
bcg edfbc gdfc cgaebf beadcf becdg cbadefg eagbd fgdbec cg | fbcade cgfbea gc cg
gfdecba dgeabc decbgf fbae dbaeg adegf abdgef agcfd fe efg | dgefa fbdgae becfadg egf
fab bf dbef bdacfg eabcg dgafeb aebfg fdgae afgdce fcedbag | agedf afb fb efdb
daceb bf afgb fdbca cgdefa dgcfa bfcgda cgebadf ebcdgf bdf | gbaf bdace dfb ceadgfb
deb ebgfacd fgbadc dfbecg ecadb fbaced afde cbage de dabcf | de dgbface afdcb fead
baefc fge agecfd eg gdeb fdagb eagbf dfgbaec dgcabf dbgafe | ebcfgad afcbe gdfaeb dgcafe
fdgbe afbc bae bdaceg fagbe bacdfge cgafed ab fgace aebfgc | ebgdf adfgbec cdabgfe fegac
be fbaedc adegfb dbecf gcadfb gfdce afbdc aceb fbe gdbefac | feb cgdef bace be
ebgfca gcafd ead gcadbef acebfd aegbc gcdae bdeg ed gcdeba | cadge dea eda bafgce
df bdceaf aefgd afdegc geadc bagef dgfc fdgbcae bcdaeg daf | fda begfdca agdfebc fcdg
fadegb cfadgeb gabdf fdceag ecdabf gaf fg afedb acdgb fegb | cbgda fdcgae bgafd efgabcd
bcfdae gbecd gedcafb aedfgc gaeb gdaebc ge cfdgb acebd egd | dbface eg cedgb edg
edfa acbfge af abcfd dcebfa fca gaecfbd bdaecg cgdfb ecbad | gdbcf degcba bafcd fa
dgcfba cfbgd bfgad geabfdc gbfea cfad abd efcgdb edabcg da | dfabg adb dab fdac
edcagb dgbafe fcaebdg adfe bgafc gfabe gfe fe ebgda gefdbc | gdeba afegb ef gfecbd
fdbca fc cabed abgdf edcabg ecaf fbc dcafeb cfabedg gdecbf | baced ebagcfd fbdga ceaf
cfaebg acfge bg efcgda bcfed egb bagf baedgc cfebg gacfebd | fabecgd bge geb afgb
bcagdf fcaeb baefdc cdgea abd gcbeaf ebdf cdbae gdbcfea db | cdgae edfb afcdeb gecda
gcefab de dfcageb gebcf gdbce cgdab agdfbe dbcegf bed fdce | de ed ebd bcagfe
feabdg cf fcaedb fgebc cdgeb bacfeg cfb beafg ceagbdf cafg | afgc fbc cf gbfec
aebfg bcdga dfgbaec cbaegd ade cegd fbcdag daegb de edacfb | cbadfe abgdc de agcdb
cdafg gafcbd cebdf dafgeb ae dbgeacf edgcfa aceg fdcea afe | efdgca acdfe dcgaf adfcg
dbeaf dgfceb cfbae adcb cedfba bd fgade bfd bdegcfa bgcfea | fgedbc daebf efdba ceafb
cedfga edgbf gbfdeca cdage cgbefa bcda gdeba ba gbdeca bag | gdbef gecda gab acbfeg
cbfage gbfdce aedbc bdagce db fbcaedg edb afdce bgda cebag | bdgefac bde agbd agbfedc
cabe fbaced adgbf fbcedag aedfc ebfdgc gcdaef eb bfaed feb | bef facde fdcea aecb
afcdgbe gdecf fgeabd gaf ag fbdae abge agdfe gcbfda facebd | aebdgf eabgfd dbcefa edagf
df cfd gaebcf bedacgf dcbgf dgecb gabfc bafd fbagdc egdfac | gcbdf cabdgf fd ecdbg
adcfb cbdef adcebg fa dbcag baf gdcfba fgca bfdgace bfegad | af fcga dcbef baf
ecdfa acgbfd ecdfab fdaebcg agfce dae dbef bcafd gbdace ed | fcdae ed befd eda
cf agecf gadbce badfgc caf gacbe eafdg beadgcf ebfc cagefb | cf bfgeac gdacbf agfde
dfab fdcgbe afg fa bgfcd gedafc bagcf dcabgf gbcea gcdfbea | egfcdb bfacg fa gbdeafc
cedgbf gfedc adbgce cgadbef fcdag acfe gca bdafg ac acedfg | eagdcf bgcfde acdfg ac
cabed gdbcfea bacfge egc cg gefad acdge dbcg fcebad gecadb | cdbg fdcgeba bgfcae cegad
gdebac fg efgd afgceb fabdc agdbe afdegb gaf gdfba eafdcgb | gf gebcaf agf bedcfga
fcbdeag dbegc fgb fgead fb gdfbe afbedg bcfaeg bdfa gfdace | gfeda efbagd defgb fbg
cagdbfe fcegd fdgac fe feabdg cebdg gdcfbe bacdeg fcbe edf | bacegd gfdce fe adbgec
afdebc fcebgd fgdabec gedf egb cbfed ge bgacd gdecb bacegf | egb egb cdabfe dgef
agbd cagde adgcfe dfgaecb begfc cab aegbcd dbcafe ab ebcga | aecbgd becgfda gbda fdabce
cbedfg fgeadb gadcfeb fecag df fbda eagbd bgcade def deagf | gcdeba feagd edf cagbed
gefdcba adcfg baedcf dag fdcbga cfbda gd eacdgb gdfb fgace | gda fdbac dcfbae fdbg
gfaed fc bdafge efdbgc adcgef cbfdage adcef cdf dabce cgaf | degaf fcd cbfgdea ecbdafg
fac cbfeag aegdcfb aegfd aecgb cf abedgc becf afegc dbgfac | cefga eagbc acbedg acf
fegdac aegfdcb fdeg adgce cbade adgcfb dfcag eg gea bfgcea | fdcga adefbcg efgd cgdafb
cgedabf adg egadcb gebcfa fdab cfgad ecdgf ad badcfg agbfc | egcdba da ecbfga ecgbad
fg gadfec afcg decaf fbdcge gfd badfceg ebfdca adgeb faedg | dfg cgfa afcg fedac
fgbce df agedc edf dcegfa aegdcb edfgab fbegdac efcdg fcda | aedcg dgcef dcbaeg edf
abfgc egf beagdf ef gface cbedag gadfbec cfdaeg cdaeg fdec | dfec fegdba gef cfde
gefca dcfebag cdafe fagdec gfed fcbdga dfa aecdb cbgefa fd | cbaegdf daf agfdce ebfacgd
gc efbdga gacdfb bfced dgbfa cdfbg gcd facg aefbgdc ecbdga | agfc abgcfd cgd acbgfd
abdg bcdaf cdfbag gb cdabgef afgceb dgbfc gbf dcbefa efdcg | dbag gb bg dgab
efdgbca edgf dceaf bdefca gad ecgbad dg cafgb eagfdc acfdg | bdacfeg gacedb cdegfa agdfc
agdefcb eag dfgab fcgbad fcgeb degafb ecdbag bagfe ae dfae | efda gfeacbd ea deagbc
dbe afgde bdcf gadefcb degbca becaf eabfd fdbcea befcag bd | bed ebacdg gcfabde fceab
bade gcbfd abf fecbdga dafecg dbgfa gcbefa abfdge ba egdaf | ba gdacef fgacde cbafged
bfae dbgfcea bdceg ba dcbfga geabd adb eagfd cefagd befgad | efagdc ab ba egfad
ef dgebcf ecfb fecabdg edfbg defcga fgbad egdcb fde bedcga | gdcebaf edgcb aedfgcb efacdgb
caefbg dfcgbe gadbfe gcefa gbcafed ebgaf cgba ceg cg adecf | gafce ecg cge egfbadc
adfgebc ebdac bgafec cdgb aecgd gce egabcd cdaefb cg degfa | becfad gc gdaec dgbc
bfdega gad gebfcd egcdba egdaf edgbf ag ecdfa bafg bdgfaec | fegbdca dga fgcedb cgdeba
gafed dg cabefd cfdgbea cbagfd aebfdg edgb fdg fgeac dfabe | fgbeda eadfb fgd agcfe
gfc afcbeg cfagd acgedf fdabg gc cgde acdfe fecgdab ecfbad | gbfad cfg eacdgf dfeagc
da gdafb bgacf abdcgf dcag fgbeacd faebcd fda bacgfe degbf | ad cfbga edgfb ebdfca
dbacgfe agebdc bdcf feabcd cedba aefcd fad fgace gabfde df | adfce bfcd cabedf cfdb
cfgaed adb dfeac becdaf ba fcba dbfage gcbde dafcegb deacb | dab agdefb cfadbe dba
degbac dea dbaecfg dabc dafgce eadbg ebdgf cebgaf bgeac ad | gefbd gbecda egdcaf ebcag
bdefca abcdfg gcefabd gbc eafbg baedc begac deagcb egdc cg | acegb defgcba cbaed cebdfag
bdfcg gdbfe gecf befadg dgc dgecba afbdc dfbecag cbdegf gc | cg dgc fcge acbegd
aefbgdc gbeac badcg gaebfc dfbeag gdfbc gaedbc deca ad abd | gbcaed bgefcda eacd efagcb
gbcfda gfacb ebacg aecfdb ace edbag cegf bfgeca daecfgb ce | cgef gfce ce cea
gaecb ga gac edcfbg dafgbc cfebdag gbaefc fegcb acbde fgae | ag ag cag afge
agcdfb cgbfa bfgeac eg gec cbdage fgceabd cfbge edfbc fgea | bcfga cfebg cge bdcef
ed edaf afdcbg gdace fecdgb bdgcefa gacdf edg ecdgaf bcgea | egbfdc aecgd fgdca cabdegf
bcgfda fcbegd acfbeg baefg ge agbcdef gcea beg eadfb fbacg | baefg faebg fdgcbe bgdecf
fdgbe aefbdcg cfebd gceb cbgadf fbc gfdbae ecfda cb bcgefd | fgbdce gdfacb bfc egbc
`.trim().split('\n').map(parse)

console.log(count1478(test))
console.log(sumOutput(test))