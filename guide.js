/* Yaşa göre rehber metinleri ve motivasyon sözleri. Metinler genel bilgidir, doktor önerisinin yerine geçmez. */
(function () {
  var STAGES = [
    {
      max: 4, id: 0, title: '0-3 ay: Uykuyu bebek yönlendirir',
      nap: 'Gündüz uykuları düzensizdir, günde 4-5 uykuya kadar çıkabilir.',
      points: [
        'Bu yaşta uyku eğitimi önerilmez. Gerektiğinde emzirmek, kucağa almak ve sallamak normaldir.',
        'Gündüz-gece ayrımı yavaş oturur: gündüz aydınlık ve sesli, gece loş ve sessiz tutun.',
        'Uyanık kalma süresi kısadır. Esneme, bakışı kaçırma ve huzursuzluğu uyku işareti sayın.',
        'Her uyku sırtüstü, sert ve boş bir yatakta olsun.'
      ],
      steps: [
        '<b>Hazırlık.</b> Loş oda, hep aynı kısa rutin (bez, ninni).',
        '<b>Uyku işaretlerini görünce yatırın:</b> esneme, bakışı kaçırma, huzursuzluk.',
        '<b>Kucakta, emzirirken ya da sallayarak uyutmak</b> bu yaşta sorun değildir.',
        '<b>Derin uykuya geçince</b> sırtüstü, sert ve boş bir yatağa bırakın.',
        '<b>Sık uyanma ve sık beslenme</b> bu yaşta beklenir. Geri adım sayılmaz.'
      ],
      night: 'Gece uyanışlarında en olası neden açlıktır. Önce beslenme, bez ve gaz kontrolü yapın.',
      heavy: 'Bu yaşta yoğun ağlamayı beklemeyin, bebeği sakinleştirmeye odaklanın. Ateş, beslenmeme ya da olağandışı bir durum varsa doktora başvurun.',
      trend: 'Büyüme atakları, gaz ve beslenme düzeni', ready: 'Bu yaşta hedef basamak koymaya gerek yok. Kayıt tutmak düzeni görmeniz için yeterli.'
    },
    {
      max: 6, id: 1, title: '4-6 ay: Uyku döngüleri değişiyor',
      nap: 'Genellikle günde 3-4 gündüz uykusu. Akşam yatışı erkene çekilebilir.',
      points: [
        '4. ay civarında uyku döngüleri olgunlaşır, gece uyanmaları artabilir. Geçici bir dönemdir.',
        'Dönmeyi öğrenme uykuda da denenir, bebek yüzüstü kalmak isteyebilir.',
        'Sabit bir uyku rutini kurmak için iyi zaman: banyo, besleme, ninni, yatak.',
        'Uyku eğitimine başlamadan doktorunuzla konuşun. Her bebek bu yaşta hazır olmayabilir.'
      ],
      steps: [
        '<b>Hazırlık.</b> Oda loş, hep aynı ninni ya da beyaz gürültü. Bez ve açlığı kontrol edin.',
        '<b>Uykulu ama uyanıkken beşiğe koyun.</b> Gözler kapanmak üzereyken koymak yeterli.',
        '<b>Hedef basamaktan başlayın: {hedef}.</b> Her basamakta 3-5 dakika kalın.',
        '<b>Sakinleşmezse bir üst basamağa çıkın</b> ve aynı seansta geri inmeyin.',
        '<b>Kucağa ya da emzirmeye geçtiyseniz,</b> sakinleşince beşiğe indirin ve orada bitirin.',
        '<b>30-40 dakikayı geçtiyse</b> uykuyu destekli bitirin. Bu geri adım sayılmaz.'
      ],
      night: 'Bu yaşta gece açlığı hâlâ olasıdır. Önce beslenme ve bez kontrolü, sonra en hafif basamak.',
      heavy: 'Ağlama yoğun gidiyor. 4. ay değişimi ya da yorgunluk olabilir. Hedefi düşürmeyin, bir üst basamağa çıkın ve gündüz uykularını biraz erkene alın.',
      trend: '4. ay uyku değişimi, dönme çalışması ve diş', ready: null
    },
    {
      max: 7.5, id: 2, title: '6-7,5 ay: Ek gıda, diş ve oturma dönemi',
      nap: 'Çoğunlukla günde 3 uyku. Sonuncusu kısa bir "köprü" uykusu olabilir.',
      points: [
        'Ek gıdaya geçiş ve diş çıkarma uykuyu bozabilir. Birkaç gün ile birkaç hafta sürer.',
        'Oturmayı ve emeklemeyi denemeye başlar. Gün içinde yerde serbest hareket alanı verin.',
        'Gece beslenme ihtiyacı değişir. Gece emzirme ya da mama konusunda doktorunuza danışın.',
        'Ayrılık kaygısının ilk işaretleri görülebilir.'
      ],
      steps: [
        '<b>Hazırlık.</b> Oda loş, hep aynı ninni ya da beyaz gürültü. Bez ve açlığı kontrol edin.',
        '<b>Uykulu ama uyanıkken beşiğe koyun.</b> Gözler kapanmak üzereyken koymak yeterli.',
        '<b>Hedef basamaktan başlayın: {hedef}.</b> Her basamakta yaklaşık 5 dakika kalın. Ağlama inip çıkıyorsa süreyi uzatabilirsiniz.',
        '<b>Sakinleşmezse bir üst basamağa çıkın</b> ve aynı seansta geri inmeyin.',
        '<b>Kucağa ya da emzirmeye geçtiyseniz,</b> sakinleşince uykuya dalmadan beşiğe indirin ve orada bitirin.',
        '<b>40 dakikayı geçtiyse</b> ya da bebek çok yorulduysa uykuyu destekli bitirin. Bu geri adım sayılmaz.'
      ],
      night: 'Gece uyanırsa önce en hafif basamağı deneyin (emzik, ses, dokunuş), sonra bir üst basamağa çıkın. Gaz ya da diş ağrısı varsa önce onu rahatlatın.',
      heavy: 'Ağlama yoğun gidiyor. Diş, ek gıda ya da yeni bir beceri uykuyu bozuyor olabilir. Hedefi şimdilik düşürmeyin, aynı basamakta ya da bir üstte kalın.',
      trend: 'Diş, ek gıda ve yeni beceri', ready: null
    },
    {
      max: 9, id: 3, title: '7,5-9 ay: Ayrılık kaygısı ve 8. ay atağı',
      nap: 'Günde 3 uyku, 8-9 ay arasında üçüncüsü kısalıp 2 uykuya geçiş başlayabilir.',
      points: [
        'Ayrılık kaygısı başlar: sizi göremeyince ağlayabilir. Bu bağlanmanın sağlıklı bir işareti.',
        'Emekleme ve ayağa kalkma denemeleri uykuda da sürer, çok dönmesi normal.',
        '3. uyku giderek kısalıyorsa ve akşam yatışı zorlaşıyorsa 2 uykuya geçiş zamanı gelmiş olabilir.',
        'Diş ve 8. ay atağı birkaç hafta sürebilir. Bu dönemde hedefi bir süre sabit tutmak makul.'
      ],
      steps: [
        '<b>Hazırlık.</b> Oda loş, hep aynı ninni ya da beyaz gürültü. Bez ve açlığı kontrol edin.',
        '<b>Uykulu ama uyanıkken beşiğe koyun.</b> Gözler kapanmak üzereyken koymak yeterli.',
        '<b>Hedef basamaktan başlayın: {hedef}.</b> Her basamakta yaklaşık 5 dakika kalın. Ağlama inip çıkıyorsa süreyi uzatabilirsiniz.',
        '<b>Sakinleşmezse bir üst basamağa çıkın</b> ve aynı seansta geri inmeyin.',
        '<b>Kucağa ya da emzirmeye geçtiyseniz,</b> sakinleşince uykuya dalmadan beşiğe indirin ve orada bitirin.',
        '<b>40 dakikayı geçtiyse</b> ya da bebek çok yorulduysa uykuyu destekli bitirin. Bu geri adım sayılmaz.'
      ],
      night: 'Gece uyanırsa önce en hafif basamağı deneyin (emzik, ses, dokunuş), sonra bir üst basamağa çıkın. Gaz ya da diş ağrısı varsa önce onu rahatlatın.',
      heavy: 'Ağlama yoğun gidiyor. Diş ya da 8. ay atağı geçene kadar aynı basamakta, hatta bir üstte kalmak makul.',
      trend: 'Diş, 8. ay atağı ve ayrılık kaygısı', ready: null
    },
    {
      max: 12, id: 4, title: '9-11 ay: İki uyku, ayrılık kaygısı yoğun',
      nap: 'Çoğu bebek günde 2 uykuya oturur: sabah ve öğleden sonra. Akşam yatışı 19:00-20:00 arası iyi olur.',
      points: [
        'Ayrılık kaygısı bu aylarda yoğun olabilir. Uyku öncesi kısa, sakin ve hep aynı vedalaşma yardımcı olur.',
        'Beşikte ayağa kalkıp inmeyi bilmeyebilir. Gündüz inme ve oturma pratiği yaptırın.',
        'Sabit uyku saatleri ve sabit rutin bu dönemde en çok işe yarar.',
        'Gece uyanıp oyun istiyorsa kısa ve sıkıcı kalın: ışığı açmayın, az konuşun.'
      ],
      steps: [
        '<b>Hazırlık.</b> Oda loş, hep aynı kısa rutin: banyo, besleme, kitap ya da ninni.',
        '<b>Uykulu ama uyanıkken beşiğe koyun</b> ve kısa, sakin bir vedalaşma yapın.',
        '<b>Hedef basamaktan başlayın: {hedef}.</b> Her basamakta yaklaşık 5 dakika kalın.',
        '<b>Ayağa kalktıysa</b> sakince yatırın, kısa dokunup çıkın. Uzun konuşmayın.',
        '<b>Sakinleşmezse bir üst basamağa çıkın</b> ve aynı seansta geri inmeyin.',
        '<b>40 dakikayı geçtiyse</b> uykuyu destekli bitirin. Bu geri adım sayılmaz.'
      ],
      night: 'Beşikte ayağa kalkmışsa yatırıp kısa dokunun, uzun etkileşime girmeyin. Açlık ve diş de olası nedenler.',
      heavy: 'Ağlama yoğun gidiyor. Ayrılık kaygısı ve ayağa kalkma bu aylarda uykuyu zorlar. Hedefi düşürmeyin, rutine sadık kalın.',
      trend: 'Ayrılık kaygısı, ayağa kalkma ve diş', ready: null
    },
    {
      max: 15, id: 5, title: '12-15 ay: Yürüme ve tek uykuya hazırlık',
      nap: 'Çoğunlukla 2 uyku. 12-18 ay arasında çoğu çocuk tek uykuya geçer.',
      points: [
        'Yürüme çalışması uykuyu etkileyebilir, bazen gece de ayağa kalkıp denemek ister.',
        'Sabah uykusu direnmeye ya da öğle uykusu çok kısalmaya başlarsa tek uykuya geçiş yaklaşıyor olabilir.',
        'Hâlâ 2 uykuyla iyi gidiyorsa acele etmeyin.',
        'Gece beslenmesi ve emzik/biberon alışkanlıkları için doktorunuza danışın.'
      ],
      steps: [
        '<b>Hazırlık.</b> Oda loş, hep aynı rutin: banyo, besleme, kitap, ninni.',
        '<b>Uykulu ama uyanıkken yatağa koyun</b> ve kısa vedalaşın.',
        '<b>Hedef basamaktan başlayın: {hedef}.</b> Her basamakta yaklaşık 5 dakika kalın.',
        '<b>Sakinleşmezse bir üst basamağa çıkın</b> ve aynı seansta geri inmeyin.',
        '<b>Oyun istiyorsa</b> kısa ve sıkıcı kalın: ışık yok, az konuşma.',
        '<b>40 dakikayı geçtiyse</b> uykuyu destekli bitirin. Bu geri adım sayılmaz.'
      ],
      night: 'Gece uyanıp oyun istiyorsa kısa ve sıkıcı kalın: ışığı açmayın, az konuşun. Diş (azı) ağrısını da düşünün.',
      heavy: 'Ağlama yoğun gidiyor. Yürüme atağı, azı dişleri ve uyku geçişi aynı döneme denk gelebilir. Hedefi bir süre sabit tutun.',
      trend: 'Yürüme atağı, azı dişleri ve uyku geçişi', ready: null
    },
    {
      max: 999, id: 6, title: '15 ay ve sonrası: Tek uyku ve sınırlar',
      nap: 'Genellikle öğle saatinde tek uyku, 1,5-2,5 saat.',
      points: [
        'Yatma saatinde "bir daha" istekleri ve sınır testi başlar. Sabit, kısa bir rutin ve tutarlılık işe yarar.',
        'Hayal gücü ve korkular gece uyanmalarını artırabilir. Sakin güvence verin.',
        'Gündüz uykusu çok uzarsa gece yatışı gecikir. Öğle uykusunu 15:00-15:30 civarında bitirmeye çalışın.',
        'Yataktan çıkmaya başlarsa oda güvenliğini yeniden gözden geçirin.'
      ],
      steps: [
        '<b>Hazırlık.</b> Oda loş, hep aynı rutin: banyo, diş fırçalama, kitap, ninni.',
        '<b>Uykulu ama uyanıkken yatağa koyun</b> ve kısa, sakin bir veda edin.',
        '<b>Hedef basamaktan başlayın: {hedef}.</b> Her basamakta yaklaşık 5 dakika kalın.',
        '<b>Yataktan çıkarsa</b> sessizce geri götürün, az konuşun, her seferinde aynı şekilde.',
        '<b>Korkuyorsa</b> kısa güvence verin ve odadan çıkın.',
        '<b>40 dakikayı geçtiyse</b> uykuyu destekli bitirin. Bu geri adım sayılmaz.'
      ],
      night: 'Gece uyanırsa sakin ve kısa kalın. Kötü rüya ya da korku olabilir, kısa güvence verip yatağına geri götürün.',
      heavy: 'Ağlama yoğun gidiyor. Sınır testi, korkular ya da gelişim atağı olabilir. Tutarlı kalın ve hedefi bir süre sabit tutun.',
      trend: 'Sınır testi, korkular ve diş', ready: null
    }
  ];

  var MOT = {
    genel: [
      'Uykuyla uğraşmak yorucu bir iş. Bunu fark etmek ve devam etmek, iyi bir ebeveynin işi.',
      'Her gece aynı olmayacak. İyi geceler de, kötü geceler de bu sürecin parçası.',
      'Bebeğiniz bu işi sizinle öğreniyor. Acele etmeniz gerekmiyor.',
      'Bugün yaptığınız küçük bir adım bile ilerlemedir.',
      'Mükemmel olmak zorunda değilsiniz. Yeterince iyi bir ebeveyn olmak yeterli.',
      'Yorgunluğunuz gerçek. Mümkünse bugün bir kısa dinlenme için yardım isteyin.',
      'Kayıt tutuyor olmanız bile bebeğinizin ritmini anlamaya çalıştığınızı gösterir.',
      'Bebeğiniz sizin sesinizden, kokunuzdan ve dokunuşunuzdan güven alıyor. Bu zaten en büyük destek.',
      'Uyku bir beceri. Beceriler tekrarla ve zamanla gelişir.',
      'Karşılaştırmayın. Her bebek kendi hızında öğrenir.',
      'Bugün kendinize de nazik olun. Siz de yoruldunuz.',
      'Zor bir gün, bir geri adım değildir. Yarın yeni bir deneme.',
      'Eşinizle nöbetleşin. Bu işi tek başınıza taşımak zorunda değilsiniz.',
      'Gece saatleri uzun gelir, ama sabah mutlaka olur.',
      'Su için, bir şeyler yiyin. Bebeğinize bakmak için size de bakılmalı.',
      'Uyku düzeni haftalar içinde oturur. Bugünkü gece, tüm hikâye değil.'
    ],
    zor: [
      'Çok ağlayan bir bebekle uğraşmak yıpratıcıdır. Duygularınız çok normal. Derin bir nefes alın.',
      'Zor bir gün geçirdiniz. Bu, sizin ya da bebeğinizin başarısızlığı değil.',
      'Yoğun ağlama günleri olur. Yanında olmanız zaten en önemli şey.',
      'Bugün çok zor olduysa hedefi bırakıp bebeği sakinleştirmek geri adım değildir. Yarın tekrar deneyebilirsiniz.',
      'Bir nefes alın. Bebeğinizi güvenle yatırdıysanız, kısa bir mola vermek sizin hakkınız.',
      'Ağlaması sizi yıprattıysa bunu yalnız taşımayın. Eşinizden ya da yakınınızdan destek isteyin.'
    ],
    iyi: [
      'Kayıtlara bakılırsa son uykular daha kolay geçiyor. Emeğiniz karşılığını veriyor!',
      'İlerleme var. Küçük görünse de bu adımlar birikiyor.',
      'Bebeğiniz öğreniyor, siz de öğreniyorsunuz. Harika gidiyorsunuz.',
      'Sabrınız işe yarıyor. Bu iyi gidişi kutlamayı unutmayın.',
      'Son uykular iyi geçmiş. Bu, sizin tutarlılığınızın sonucu.'
    ],
    gece: [
      'Gece uyanıklığı zor, ama yalnız değilsiniz. Sabah olacak.',
      'Gece nöbetinde olmanız çok değerli. Bir şekilde yeniden uyuyacak.',
      'Bu saatlerde sabır en büyük gücünüz. Siz çok iyi yapıyorsunuz.',
      'Gece uyanmaları geçici bir dönem. Bu da geçecek.'
    ]
  };

  /* Dokunuşu kademeli azaltma: "kademeli geri çekilme" ilkesinin pat sıklığına uyarlaması. */
  var FADE = [
    { t: 'Sürekli pat', d: 'Nefes ritminde, yaklaşık saniyede bir yumuşak pat. Kesintisiz.', cyc: null },
    { t: 'Pat ve kısa mola', d: '10 sn pat, 3 sn dur (elin üstte kalsın), tekrar.', cyc: [10, 3] },
    { t: 'Eşit pat ve mola', d: '5 sn pat, 5 sn dur.', cyc: [5, 5] },
    { t: 'Az pat, uzun mola', d: '3 sn pat, 10 sn dur.', cyc: [3, 10] },
    { t: 'Sadece el', d: 'Pat yok. Elin sırtında ya da göğsünde sabit durur.', cyc: null },
    { t: 'El yakında', d: 'Elin beşikte, dokunmadan yakında. Ağlarsa bir önceki aşamaya dön.', cyc: null }
  ];
  var METHODS = [
    { t: 'Kademeli geri çekilme (dokunuşu azaltma)',
      s: ['Bebek beşikte, sen yanındasın. Kaldırmadan dokunur, pat yaparsın.',
          'Pat sıklığını aşama aşama azaltırsın (yukarıdaki 6 aşama), sonra eli çekersin.',
          'Ağlama artarsa o seansta bir önceki aşamaya dönersin, sakinleşince devam edersin.',
          'Aşamayı, son 3 uykuda ağlama azsa ilerletirsin. Atak ve diş günlerinde aynı aşamada kalırsın.'],
      e: 'Dokunuşu azaltan "chair method / camping out" için tek bir kontrollü çalışma var (9-18 ay, 48 çocuk): uykuya dalma süresi ve gece uyanmaları azaldı, bırakan olmadı. Yazarlar yetersiz kanıt nedeniyle henüz resmî öneri vermiyor. Pat sayısını azaltma şekli bu uygulamanın uyarlamasıdır, ayrı bir çalışması yok.' },
    { t: 'Yatır-kaldır',
      s: ['Uykulu ama uyanıkken beşiğe yatır.',
          'Ağlama başlarsa kaldır, sakinleşene kadar kucakta tut.',
          'Sakinleşir sakinleşmez, uyumadan tekrar yatır. Gerekirse tekrarla.',
          '30-40 dakikayı geçtiyse destekli bitir.'],
      e: 'Bulduğum derlemelerde ayrı olarak değerlendirilmemiş. Bazı bebeklerde kaldırıp indirmek uyarılmayı artırır. Bebek bu yüzden daha çok ağlıyorsa beşikte kucaklama ve dokunuş daha uygun olabilir.' },
    { t: 'Yatış saatini kaydırma',
      s: ['Yatış saatini bebeğin doğal uykuya geçtiği saate çek (uyanıkken beşikte uzun uğraşmamak için).',
          'Dalma süresi kısaldıkça her 2-3 günde 15 dakika erkene al.'],
      e: 'Küçük bir çalışmada (6-16 ay, 15 çocuk) uykuya dalma süresini ve gece uyanmalarını azalttı. Kanıt sınırlı. Zaten kayıtlarınızdaki yatış saatini bu yönteme göre ayarlayabilirsiniz.' }
  ];
  var SOURCES = [
    { t: 'AASM uygulama parametreleri (Mindell ve ark., 2006)', u: 'https://aasm.org/wp-content/uploads/2017/07/PP_NightWakingsChildren.pdf' },
    { t: 'Davranışsal uyku müdahaleleri, sistematik derleme (Sleep Medicine Reviews, 2024)', u: 'https://sommeilenfant.org/images/documents/Lecuelle2024.pdf' },
    { t: 'Uyku ve yatıştırma müdahaleleri, hızlı derleme (Sax Institute)', u: 'https://www.saxinstitute.org.au/wp-content/uploads/Sleep-and-Settling-Interventions-Evidence-Check.pdf' }
  ];

  /* Ay ay uyanıklık penceresi (dakika). Kaynaklar birbirinden farklı, ortak aralık alındı, genişlik 1 saat. */
  var WIN = { 4: [90, 150], 5: [105, 165], 6: [120, 180], 7: [135, 195], 8: [150, 210], 9: [165, 225], 10: [180, 240],
    11: [180, 240], 12: [195, 255], 13: [195, 255], 14: [195, 255], 15: [270, 330], 16: [270, 330], 17: [270, 330], 18: [300, 360] };
  var NAPCOUNT = { 4: '3-4', 5: '3', 6: '2-3', 7: '2-3', 8: '2 (bazen 3)', 9: '2', 10: '2', 11: '2', 12: '2 (bazen 1)', 13: '2', 14: '2 (bazen 1)', 15: '1', 16: '1', 17: '1', 18: '1' };
  var NAPL = { 4: [90, 90, 60], 5: [90, 90, 45], 6: [90, 75, 40], 7: [90, 75, 40], 8: [100, 80], 9: [90, 90], 10: [90, 90], 11: [90, 75],
    12: [90, 60], 13: [90, 60], 14: [90, 60], 15: [120], 16: [120], 17: [120], 18: [120] };
  function win(f) {
    if (isNaN(f)) f = 8;
    if (f < 1) return [45, 90];
    if (f < 2) return [60, 105];
    if (f < 3) return [75, 120];
    if (f < 4) return [90, 135];
    return WIN[Math.min(18, Math.floor(f))];
  }
  var GEN = { 1: [120], 2: [90, 75], 3: [90, 75, 40], 4: [75, 75, 60, 30] };
  function autoNaps(f) { if (isNaN(f)) return 3; if (f < 4) return 4; if (f < 8) return 3; if (f < 15) return 2; return 1; }
  function sample(f, wake, bed, n) {
    var m = Math.floor(f);
    if (isNaN(f) || m < 4) return null;
    var def = NAPL[Math.min(18, m)], L = (n > 0 && n !== def.length && GEN[n]) ? GEN[n] : def, sum = L.reduce(function (a, b) { return a + b; }, 0);
    var gap = Math.round((bed - wake - sum) / (L.length + 1) / 5) * 5, t = wake, rows = [{ k: 'Uyanış', a: wake }];
    L.forEach(function (len, i) { var s = t + gap; rows.push({ k: (i + 1) + '. uyku', a: s, b: s + len }); t = s + len; });
    rows.push({ k: 'Yatış', a: bed });
    var w = win(f);
    return { rows: rows, gap: gap, win: w, ok: gap >= w[0] - 10 && gap <= w[1] + 10, last: bed - t };
  }
  var WIN_SOURCES = [
    { t: 'Sleep Lady: yaşa göre uyanıklık süreleri', u: 'https://sleeplady.com/baby-sleep/wake-windows-by-age/' },
    { t: 'Newton Baby: aya göre uyanıklık süreleri', u: 'https://newtonbaby.com/blogs/parenting-kids/wake-windows-by-age' },
    { t: 'Cradlewise: ilk yıl uyku düzeni', u: 'https://cradlewise.com/blog/baby-sleep-schedule-first-year' },
    { t: 'Little Ones: bebek uyku programı', u: 'https://www.littleones.co/blogs/our-blog/baby-sleep-schedule' }
  ];

  function stage(f) {
    if (isNaN(f)) f = 8;
    for (var i = 0; i < STAGES.length; i++) if (f < STAGES[i].max) return STAGES[i];
    return STAGES[STAGES.length - 1];
  }

  window.UykuGuide = {
    stage: stage,
    autoNaps: autoNaps,
    win: win,
    sample: sample,
    winTable: function () { var o = []; for (var m = 4; m <= 18; m++) o.push({ m: m, w: WIN[m], n: NAPCOUNT[m] }); return o; },
    winSources: WIN_SOURCES,
    fade: FADE,
    methods: METHODS,
    sources: SOURCES,
    steps: function (f, hedef) {
      return stage(f).steps.map(function (t) { return '<li>' + t.replace('{hedef}', hedef) + '</li>'; }).join('');
    },
    night: function (f) { return stage(f).night; },
    heavy: function (f) { return stage(f).heavy; },
    trend: function (f) { return stage(f).trend + ' dönemlerinde bu beklenir.'; },
    ready: function (f) { return stage(f).ready; },
    motivation: function (ctx, day) {
      var list = MOT[ctx] || MOT.genel;
      return list[((day % list.length) + list.length) % list.length];
    }
  };
})();
