// 시작 가격
//  - rate/amt 가 있는 종목 (실제): 2026-10-13 토스증권 거래대금 순위 국내·해외 각 1~100위
//    price=현재가, rate=등락률(%), amt=토스증권 거래대금(억원)
//  - 국내 (실제): 2026-10-13 장중 시세 — 삼성생명, 삼성물산, KB금융 등 코스피 시총 상위
//  - 국내 (추정): 나머지 코스피 대형주
//  - 해외: 거래대금 1~100위는 실제(아래 목록), 나머지는 추정 (JP모건 $334.30만 실제)
// 실제 시세와 연동되지 않으며, 시작 가격에서 랜덤하게 움직입니다.
const FX = 1338.45; // 원/달러 (2026-10-13 10:53 토스증권)
const STOCKS = [
  { code: '105560', mk: 'KR', name: 'KB금융',           price: 160000,  vol: 0.003 },
  { code: '032830', mk: 'KR', name: '삼성생명',         price: 259000,  vol: 0.003 },
  { code: '028260', mk: 'KR', name: '삼성물산',         price: 301000,  vol: 0.004 },
  { code: '055550', mk: 'KR', name: '신한지주',         price: 98700,   vol: 0.003 },
  { code: '000270', mk: 'KR', name: '기아',             price: 130000,  vol: 0.004 },
  { code: '068270', mk: 'KR', name: '셀트리온',         price: 210000,  vol: 0.005 },
  { code: '329180', mk: 'KR', name: 'HD현대중공업',     price: 560000,  vol: 0.007 },
  { code: '035720', mk: 'KR', name: '카카오',           price: 70000,   vol: 0.006 },
  { code: '009540', mk: 'KR', name: 'HD한국조선해양',   price: 440000,  vol: 0.006 },
  { code: '051910', mk: 'KR', name: 'LG화학',           price: 420000,  vol: 0.006 },
  { code: '086790', mk: 'KR', name: '하나금융지주',     price: 110000,  vol: 0.003 },
  { code: '096770', mk: 'KR', name: 'SK이노베이션',     price: 120000,  vol: 0.005 },
  { code: '015760', mk: 'KR', name: '한국전력',         price: 45000,   vol: 0.004 },
  { code: '138040', mk: 'KR', name: '메리츠금융지주',   price: 130000,  vol: 0.004 },
  { code: '010130', mk: 'KR', name: '고려아연',         price: 1300000, vol: 0.007 },
  { code: '011200', mk: 'KR', name: 'HMM',              price: 24000,   vol: 0.006 },
  { code: 'AAPL',   mk: 'US', name: '애플',             price: 255.00,  vol: 0.003 },
  { code: 'JPM',    mk: 'US', name: 'JP모건',           price: 334.30,  vol: 0.003 },
  { code: 'BRK.B',  mk: 'US', name: '버크셔 해서웨이',  price: 500.00,  vol: 0.002 },
  { code: 'WMT',    mk: 'US', name: '월마트',           price: 110.00,  vol: 0.003 },
  { code: 'V',      mk: 'US', name: '비자',             price: 350.00,  vol: 0.003 },
  { code: 'MA',     mk: 'US', name: '마스터카드',       price: 590.00,  vol: 0.003 },
  { code: 'XOM',    mk: 'US', name: '엑슨모빌',         price: 115.00,  vol: 0.003 },
  { code: 'COST',   mk: 'US', name: '코스트코',         price: 950.00,  vol: 0.003 },
  { code: 'NFLX',   mk: 'US', name: '넷플릭스',         price: 120.00,  vol: 0.005 },
  { code: 'JNJ',    mk: 'US', name: '존슨앤드존슨',     price: 190.00,  vol: 0.002 },
  { code: 'HD',     mk: 'US', name: '홈디포',           price: 400.00,  vol: 0.003 },
  { code: 'PG',     mk: 'US', name: 'P&G',              price: 155.00,  vol: 0.002 },
  { code: 'ABBV',   mk: 'US', name: '애브비',           price: 230.00,  vol: 0.003 },
  { code: 'BAC',    mk: 'US', name: '뱅크오브아메리카', price: 52.00,   vol: 0.004 },
  { code: 'UNH',    mk: 'US', name: '유나이티드헬스',   price: 350.00,  vol: 0.005 },
  { code: 'AMD',    mk: 'US', name: 'AMD',              price: 230.00,  vol: 0.009 },
  { code: 'KO',     mk: 'US', name: '코카콜라',         price: 70.00,   vol: 0.002 },
  { code: 'CRM',    mk: 'US', name: '세일즈포스',       price: 260.00,  vol: 0.005 },
  { code: 'CSCO',   mk: 'US', name: '시스코',           price: 72.00,   vol: 0.003 },
  // 국내 거래대금 1~50위: 2026-10-13 10:58 토스증권
  { code: '005930', mk: 'KR', name: '삼성전자', price: 231000, vol: 0.004, rate: -7.78, amt: 420 },
  { code: '000660', mk: 'KR', name: 'SK하이닉스', price: 1459000, vol: 0.006, rate: -9.09, amt: 387 },
  { code: '122630', mk: 'KR', name: 'KODEX 레버리지', price: 80160, vol: 0.008, rate: -14.37, amt: 76 },
  { code: '001210', mk: 'KR', name: '금호전기', price: 12700, vol: 0.01, rate: 14.72, amt: 64 },
  { code: '114800', mk: 'KR', name: 'KODEX 인버스', price: 1153, vol: 0.004, rate: 7.25, amt: 59 },
  { code: '009150', mk: 'KR', name: '삼성전기', price: 1337000, vol: 0.006, rate: -10.08, amt: 54 },
  { code: '402340', mk: 'KR', name: 'SK스퀘어', price: 863000, vol: 0.006, rate: -12.29, amt: 51 },
  { code: 'KX-SEMI2X', sub: 'ETF', mk: 'KR', name: 'KODEX 반도체레버리지', price: 77225, vol: 0.01, rate: -14.18, amt: 32 },
  { code: '042510', mk: 'KR', name: '라온시큐어', price: 19040, vol: 0.01, rate: 16.45, amt: 25 },
  { code: '233740', mk: 'KR', name: 'KODEX 코스닥150레버리지', price: 6430, vol: 0.008, rate: -10.38, amt: 24 },
  { code: '002990', mk: 'KR', name: '금호건설', price: 13650, vol: 0.008, rate: 1.86, amt: 22 },
  { code: '252670', mk: 'KR', name: 'KODEX 200선물인버스2X', price: 96, vol: 0.008, rate: 15.66, amt: 21 },
  { code: '069500', mk: 'KR', name: 'KODEX 200', price: 94415, vol: 0.004, rate: -7.07, amt: 20 },
  { code: '005380', mk: 'KR', name: '현대차', price: 301000, vol: 0.004, rate: -5.93, amt: 20 },
  { code: 'TG-SEMI2X', sub: 'ETF', mk: 'KR', name: 'TIGER 반도체TOP10레버리지', price: 27110, vol: 0.01, rate: -17.72, amt: 19 },
  { code: '034020', mk: 'KR', name: '두산에너빌리티', price: 68500, vol: 0.008, rate: -4.19, amt: 17 },
  { code: 'KX-SKH2X', sub: 'ETF', mk: 'KR', name: 'KODEX SK하이닉스단일종목레버리지', price: 7155, vol: 0.012, rate: -18.08, amt: 15 },
  { code: '006400', mk: 'KR', name: '삼성SDI', price: 513500, vol: 0.006, rate: -8.46, amt: 14 },
  { code: '036930', mk: 'KR', name: '주성엔지니어링', price: 246500, vol: 0.007, rate: -2.56, amt: 14 },
  { code: 'KX-200CC', sub: 'ETF', mk: 'KR', name: 'KODEX 200타겟위클리커버드콜', price: 17805, vol: 0.003, rate: -6.78, amt: 13 },
  { code: '298040', mk: 'KR', name: '효성중공업', price: 2082000, vol: 0.007, rate: -7.13, amt: 13 },
  { code: '010170', mk: 'KR', name: '대한광통신', price: 14450, vol: 0.009, rate: -8.07, amt: 12 },
  { code: '278470', mk: 'KR', name: '에이피알', price: 290000, vol: 0.008, rate: -17.61, amt: 12 },
  { code: '005935', mk: 'KR', name: '삼성전자우', price: 174100, vol: 0.004, rate: -6.79, amt: 12 },
  { code: '042700', mk: 'KR', name: '한미반도체', price: 217000, vol: 0.008, rate: -12.67, amt: 11 },
  { code: 'TG-DIVCC', sub: 'ETF', mk: 'KR', name: 'TIGER 배당커버드콜액티브', price: 17300, vol: 0.003, rate: -7.33, amt: 11 },
  { code: '066570', mk: 'KR', name: 'LG전자', price: 173200, vol: 0.005, rate: -6.22, amt: 11 },
  { code: '010120', mk: 'KR', name: 'LS ELECTRIC', price: 174600, vol: 0.007, rate: -4.9, amt: 10 },
  { code: 'HT-ROBO', sub: '국내', mk: 'KR', name: 'HT로보틱스', price: 6340, vol: 0.01, rate: 5.66, amt: 8.1 },
  { code: '035420', mk: 'KR', name: 'NAVER', price: 174100, vol: 0.005, rate: -3.54, amt: 7.9 },
  { code: '108490', mk: 'KR', name: '로보티즈', price: 236000, vol: 0.009, rate: -8.17, amt: 7.9 },
  { code: '042660', mk: 'KR', name: '한화오션', price: 63700, vol: 0.007, rate: -5.34, amt: 7.8 },
  { code: '011070', mk: 'KR', name: 'LG이노텍', price: 439500, vol: 0.006, rate: -8.34, amt: 7.7 },
  { code: '000500', mk: 'KR', name: '가온전선', price: 271000, vol: 0.008, rate: 1.68, amt: 6.6 },
  { code: '356680', mk: 'KR', name: '엑스게이트', price: 18490, vol: 0.008, rate: -0.32, amt: 6.2 },
  { code: 'KX-200CCA', sub: 'ETF', mk: 'KR', name: 'KODEX 200커버드콜액티브', price: 7170, vol: 0.003, rate: -7.24, amt: 6.2 },
  { code: '142280', mk: 'KR', name: '녹십자엠에스', price: 4040, vol: 0.01, rate: 8.89, amt: 6.1 },
  { code: 'SOL-AI2', sub: 'ETF', mk: 'KR', name: 'SOL AI반도체TOP2플러스', price: 16230, vol: 0.006, rate: -8.3, amt: 6 },
  { code: '007660', mk: 'KR', name: '이수페타시스', price: 110700, vol: 0.008, rate: -8.43, amt: 5.9 },
  { code: 'SS-KQINV2X', sub: 'ETN', mk: 'KR', name: '삼성 인버스 2X 코스닥150 선물 ETN', price: 1773, vol: 0.008, rate: 10.46, amt: 5.6 },
  { code: '086520', mk: 'KR', name: '에코프로', price: 78700, vol: 0.008, rate: -6.42, amt: 5.3 },
  { code: 'SOL-SKHINV', sub: 'ETF', mk: 'KR', name: 'SOL SK하이닉스선물단일종목인버스2X', price: 8430, vol: 0.012, rate: 18.06, amt: 5.3 },
  { code: '043260', mk: 'KR', name: '성호전자', price: 29250, vol: 0.009, rate: -4.72, amt: 5.1 },
  { code: '058730', mk: 'KR', name: '다스코', price: 3530, vol: 0.009, rate: 4.59, amt: 5 },
  { code: 'RISE-VUCC', sub: 'ETF', mk: 'KR', name: 'RISE 코리아밸류업위클리고정커버드콜', price: 15200, vol: 0.003, rate: -6.34, amt: 4.9 },
  { code: '053800', mk: 'KR', name: '안랩', price: 86500, vol: 0.009, rate: 10.89, amt: 4.8 },
  { code: '267260', mk: 'KR', name: 'HD현대일렉트릭', price: 542000, vol: 0.007, rate: -6.87, amt: 4.6 },
  { code: 'KX-BAT2X', sub: 'ETF', mk: 'KR', name: 'KODEX 2차전지산업레버리지', price: 952, vol: 0.01, rate: -11.6, amt: 4.5 },
  { code: '411080', mk: 'KR', name: '샌즈랩', price: 7520, vol: 0.009, rate: 5.46, amt: 4.4 },
  { code: '069540', mk: 'KR', name: '빛과전자', price: 4105, vol: 0.009, rate: -5.84, amt: 4.4 },
  // 국내 거래대금 51~100위: 2026-10-13 11:11 토스증권
  { code: '009190', mk: 'KR', name: '대양금속', price: 690, vol: 0.012, rate: 24.32, amt: 4.2 },
  { code: '080220', mk: 'KR', name: '제주반도체', price: 74700, vol: 0.009, rate: -7.66, amt: 3.8 },
  { code: '403870', mk: 'KR', name: 'HPSP', price: 58900, vol: 0.008, rate: -3.44, amt: 3.7 },
  { code: '087010', mk: 'KR', name: '펩트론', price: 81500, vol: 0.009, rate: -8.93, amt: 3.7 },
  { code: '009830', mk: 'KR', name: '한화솔루션', price: 31800, vol: 0.007, rate: -7.82, amt: 3.7 },
  { code: '360750', mk: 'KR', name: 'TIGER 미국S&P500', price: 25900, vol: 0.002, rate: -0.17, amt: 3.7 },
  { code: '005490', mk: 'KR', name: 'POSCO홀딩스', price: 285500, vol: 0.005, rate: -4.51, amt: 3.6 },
  { code: '373220', mk: 'KR', name: 'LG에너지솔루션', price: 381750, vol: 0.005, rate: -4.08, amt: 3.5 },
  { code: '017670', mk: 'KR', name: 'SK텔레콤', price: 78300, vol: 0.003, rate: -1.75, amt: 3.4 },
  { code: '000720', mk: 'KR', name: '현대건설', price: 94900, vol: 0.006, rate: -5.28, amt: 3.4 },
  { code: '012450', mk: 'KR', name: '한화에어로스페이스', price: 815000, vol: 0.007, rate: -5.45, amt: 3.3 },
  { code: '058470', mk: 'KR', name: '리노공업', price: 76700, vol: 0.007, rate: -1.79, amt: 3.2 },
  { code: '102110', mk: 'KR', name: 'TIGER 200', price: 95525, vol: 0.004, rate: -6.24, amt: 3.2 },
  { code: '222800', mk: 'KR', name: '심텍', price: 141800, vol: 0.009, rate: -8.45, amt: 3.1 },
  { code: '064350', mk: 'KR', name: '현대로템', price: 94100, vol: 0.007, rate: -5.9, amt: 3.1 },
  { code: '207940', mk: 'KR', name: '삼성바이오로직스', price: 1187000, vol: 0.004, rate: -1.16, amt: 3.1 },
  { code: 'PL-HDCC', sub: 'ETF', mk: 'KR', name: 'PLUS 고배당주위클리커버드콜', price: 6090, vol: 0.003, rate: -0.81, amt: 3.1 },
  { code: '229200', mk: 'KR', name: 'KODEX 코스닥150', price: 13740, vol: 0.005, rate: -4.48, amt: 3 },
  { code: 'MA-K2INV2X', sub: 'ETN', mk: 'KR', name: '미래에셋 인버스 2X 코스피200 선물 ETN B', price: 30360, vol: 0.008, rate: 12.59, amt: 2.9 },
  { code: '000150', mk: 'KR', name: '두산', price: 1134000, vol: 0.007, rate: -7.12, amt: 2.9 },
  { code: '353200', mk: 'KR', name: '대덕전자', price: 138300, vol: 0.008, rate: -5.85, amt: 2.9 },
  { code: 'MA-SEMIINV2X', sub: 'ETN', mk: 'KR', name: '미래에셋 인버스 2X 반도체 ETN', price: 3300, vol: 0.009, rate: 12.43, amt: 2.8 },
  { code: 'DS-NEPCORES', sub: '국내', mk: 'KR', name: '덕산넵코어스', price: 13545, vol: 0.008, rate: 1, amt: 2.8 },
  { code: '082740', mk: 'KR', name: '한화엔진', price: 35150, vol: 0.008, rate: -9.64, amt: 2.8 },
  { code: '001820', mk: 'KR', name: '삼화콘덴서', price: 143600, vol: 0.008, rate: -4.33, amt: 2.7 },
  { code: '002720', mk: 'KR', name: '국제약품', price: 4025, vol: 0.009, rate: 3.33, amt: 2.7 },
  { code: '012330', mk: 'KR', name: '현대모비스', price: 340500, vol: 0.004, rate: -3.94, amt: 2.7 },
  { code: '084670', mk: 'KR', name: '동양고속', price: 38150, vol: 0.008, rate: -7.62, amt: 2.6 },
  { code: '047040', mk: 'KR', name: '대우건설', price: 15510, vol: 0.006, rate: -3.6, amt: 2.5 },
  { code: '454910', mk: 'KR', name: '두산로보틱스', price: 60200, vol: 0.008, rate: -4.74, amt: 2.5 },
  { code: '131970', mk: 'KR', name: '두산테스나', price: 124500, vol: 0.008, rate: 0.56, amt: 2.4 },
  { code: 'TG-200IT2X', sub: 'ETF', mk: 'KR', name: 'TIGER 200IT레버리지', price: 250920, vol: 0.01, rate: -16.3, amt: 2.4 },
  { code: '010140', mk: 'KR', name: '삼성중공업', price: 17470, vol: 0.008, rate: -2.99, amt: 2.4 },
  { code: '062040', mk: 'KR', name: '산일전기', price: 203500, vol: 0.008, rate: -5.12, amt: 2.3 },
  { code: '018880', mk: 'KR', name: '한온시스템', price: 3695, vol: 0.006, rate: -4.52, amt: 2.3 },
  { code: '475150', mk: 'KR', name: 'SK이터닉스', price: 42850, vol: 0.008, rate: -2.61, amt: 2.3 },
  { code: '046970', mk: 'KR', name: '우리로', price: 7670, vol: 0.009, rate: 3.5, amt: 2.2 },
  { code: '103590', mk: 'KR', name: '일진전기', price: 71400, vol: 0.008, rate: -3.25, amt: 2.2 },
  { code: '323280', mk: 'KR', name: '태성', price: 59300, vol: 0.009, rate: -4.04, amt: 2.2 },
  { code: '001440', mk: 'KR', name: '대한전선', price: 24250, vol: 0.008, rate: -5.64, amt: 2.2 },
  { code: '083650', mk: 'KR', name: '비에이치아이', price: 47700, vol: 0.009, rate: -4.79, amt: 2.2 },
  { code: '028300', mk: 'KR', name: 'HLB', price: 43700, vol: 0.008, rate: -1.57, amt: 2.1 },
  { code: '007810', mk: 'KR', name: '코리아써키트', price: 76800, vol: 0.008, rate: -4.59, amt: 2.1 },
  { code: 'KX-SEC2X', sub: 'ETF', mk: 'KR', name: 'KODEX 삼성전자단일종목레버리지', price: 9495, vol: 0.01, rate: -14.22, amt: 2.1 },
  { code: '354320', mk: 'KR', name: '알멕', price: 54600, vol: 0.008, rate: -6.02, amt: 2.1 },
  // 해외 거래대금 1~50위: 2026-10-13 10:53 토스증권 (원화 가격 → 아래에서 달러로 환산)
  { code: 'KORU', sub: 'ETF', mk: 'US', name: 'KORU', won: 18287, vol: 0.012, rate: -13.02, amt: 95 },
  { code: 'SOXL', sub: 'ETF', mk: 'US', name: 'SOXL', won: 162486, vol: 0.012, rate: -5.26, amt: 66 },
  { code: 'SOXS', sub: 'ETF', mk: 'US', name: 'SOXS', won: 52350, vol: 0.012, rate: 5.37, amt: 55 },
  { code: 'SKH-ADR', sub: 'ADR', mk: 'US', name: 'SK하이닉스(ADR)', won: 206073, vol: 0.006, rate: -4.9, amt: 15 },
  { code: 'RAM', sub: 'ETF', mk: 'US', name: 'RAM', won: 13611, vol: 0.012, rate: -8.44, amt: 11 },
  { code: 'MU', mk: 'US', name: '마이크론 테크놀로지', won: 1281018, vol: 0.006, rate: -3.03, amt: 10 },
  { code: 'RKLB', mk: 'US', name: '로켓 랩', won: 86119, vol: 0.006, rate: -1.88, amt: 9 },
  { code: 'TQQQ', sub: 'ETF', mk: 'US', name: 'TQQQ', won: 104098, vol: 0.012, rate: -2.11, amt: 8 },
  { code: 'SNDK', mk: 'US', name: '샌디스크', won: 1910207, vol: 0.006, rate: -3.85, amt: 7.6 },
  { code: 'QQQ', sub: 'ETF', mk: 'US', name: 'QQQ', won: 989774, vol: 0.002, rate: -0.68, amt: 7.4 },
  { code: 'SPACEX', sub: '해외', mk: 'US', name: '스페이스X', won: 215918, vol: 0.006, rate: -1.08, amt: 6.5 },
  { code: 'MUU', sub: 'ETF', mk: 'US', name: 'MUU', won: 39018, vol: 0.012, rate: -6.13, amt: 6.2 },
  { code: 'WISESAT', sub: '해외', mk: 'US', name: '와이즈샛 스페이스 홀딩스', won: 5650, vol: 0.006, rate: 14.01, amt: 5.8 },
  { code: 'QLD', sub: 'ETF', mk: 'US', name: 'QLD', won: 127836, vol: 0.012, rate: -1.42, amt: 5.5 },
  { code: 'VOO', sub: 'ETF', mk: 'US', name: 'VOO', won: 953761, vol: 0.002, rate: -0.15, amt: 5.1 },
  { code: 'ETHU', sub: 'ETF', mk: 'US', name: 'ETHU', won: 33635, vol: 0.012, rate: -4.47, amt: 4.9 },
  { code: 'GDXU', sub: 'ETF', mk: 'US', name: 'GDXU', won: 136251, vol: 0.012, rate: -3.32, amt: 4.7 },
  { code: 'IREN', mk: 'US', name: '아이렌', won: 45256, vol: 0.006, rate: -2.64, amt: 4.6 },
  { code: 'QQQI', sub: 'ETF', mk: 'US', name: 'QQQI', won: 74430, vol: 0.002, rate: -0.5, amt: 4.3 },
  { code: 'NVDA', mk: 'US', name: '엔비디아', won: 299339, vol: 0.006, rate: -0.98, amt: 4.3 },
  { code: 'IONQ', mk: 'US', name: '아이온큐', won: 47995, vol: 0.006, rate: -0.93, amt: 4.1 },
  { code: 'BMNR', mk: 'US', name: '비트마인 이머션 테크놀로지스', won: 31084, vol: 0.006, rate: -2.34, amt: 3.9 },
  { code: 'WF-HOLD', sub: '해외', mk: 'US', name: 'WF 홀딩', won: 20210, vol: 0.006, rate: -12.44, amt: 3.9 },
  { code: 'GOOGL', mk: 'US', name: '알파벳 A', won: 467516, vol: 0.006, rate: -0.77, amt: 3.5 },
  { code: 'MRNA', mk: 'US', name: '모더나', won: 282655, vol: 0.006, rate: -1, amt: 3.3 },
  { code: 'TSLA', mk: 'US', name: '테슬라', won: 500377, vol: 0.006, rate: -0.9, amt: 3.1 },
  { code: 'TMF', sub: 'ETF', mk: 'US', name: 'TMF', won: 35385, vol: 0.012, rate: 1.57, amt: 2.7 },
  { code: 'SQQQ', sub: 'ETF', mk: 'US', name: 'SQQQ', won: 45898, vol: 0.012, rate: 2.17, amt: 2.7 },
  { code: 'ETHD', sub: 'ETF', mk: 'US', name: 'ETHD', won: 38350, vol: 0.012, rate: 4.43, amt: 2.6 },
  { code: 'INTC', mk: 'US', name: '인텔', won: 132270, vol: 0.006, rate: -2.29, amt: 2.5 },
  { code: 'JEPQ', sub: 'ETF', mk: 'US', name: 'JEPQ', won: 81176, vol: 0.002, rate: -0.26, amt: 2.5 },
  { code: 'SGOV', sub: 'ETF', mk: 'US', name: 'SGOV', won: 134287, vol: 0.0003, rate: 0, amt: 2.4 },
  { code: 'MSFT', mk: 'US', name: '마이크로소프트', won: 721599, vol: 0.006, rate: -0.17, amt: 2.4 },
  { code: 'QQQM', sub: 'ETF', mk: 'US', name: 'QQQM', won: 407432, vol: 0.002, rate: -0.7, amt: 2.2 },
  { code: 'NVO', mk: 'US', name: '노보노디스크(ADR)', won: 51214, vol: 0.006, rate: -0.62, amt: 2.1 },
  { code: 'MRVL', mk: 'US', name: '마벨 테크놀로지', won: 343514, vol: 0.006, rate: -3.27, amt: 1.8 },
  { code: 'AVGO', mk: 'US', name: '브로드컴', won: 467944, vol: 0.006, rate: -1.24, amt: 1.7 },
  { code: 'SCHD', sub: 'ETF', mk: 'US', name: 'SCHD', won: 44535, vol: 0.002, rate: 0.24, amt: 1.6 },
  { code: 'XXRP', sub: 'ETF', mk: 'US', name: 'XXRP', won: 37856, vol: 0.012, rate: -1.35, amt: 1.6 },
  { code: 'META', mk: 'US', name: '메타', won: 983255, vol: 0.006, rate: -0.92, amt: 1.6 },
  { code: 'STABLEX', sub: '해외', mk: 'US', name: '스테이블코인X', won: 15548, vol: 0.006, rate: -8.2, amt: 1.6 },
  { code: 'ASTS', mk: 'US', name: 'AST 스페이스모바일', won: 66629, vol: 0.006, rate: -3.07, amt: 1.5 },
  { code: 'CEREBRAS', sub: '해외', mk: 'US', name: '세레브라스 시스템즈', won: 191754, vol: 0.006, rate: -2.09, amt: 1.5 },
  { code: 'AMZN', mk: 'US', name: '아마존', won: 344462, vol: 0.006, rate: -0.63, amt: 1.5 },
  { code: 'DRAM', sub: 'ETF', mk: 'US', name: 'DRAM', won: 69955, vol: 0.012, rate: -4.29, amt: 1.2 },
  { code: 'ORCL', mk: 'US', name: '오라클', won: 181254, vol: 0.006, rate: -1.23, amt: 1.1 },
  { code: 'CRCL', mk: 'US', name: '써클 인터넷 그룹', won: 109735, vol: 0.006, rate: -2.05, amt: 1.1 },
  { code: 'PLTR', mk: 'US', name: '팔란티어', won: 276230, vol: 0.006, rate: -1.05, amt: 1.1 },
  { code: 'LITE', mk: 'US', name: '루멘텀 홀딩스', won: 1294123, vol: 0.006, rate: -2.67, amt: 1.1 },
  { code: 'NBIS', mk: 'US', name: '네비우스 그룹', won: 271447, vol: 0.006, rate: -3.26, amt: 1 },
  // 해외 거래대금 51~100위: 2026-10-13 11:13~11:14 토스증권
  { code: 'CRWV', mk: 'US', name: '코어위브', won: 104446, vol: 0.01, rate: -2.57, amt: 0.8577 },
  { code: 'BE', mk: 'US', name: '블룸 에너지', won: 341443, vol: 0.005, rate: -2.54, amt: 0.8557 },
  { code: 'SNXX', sub: 'ETF', mk: 'US', name: 'SNXX', won: 15014, vol: 0.012, rate: -6.64, amt: 0.7848 },
  { code: 'DELL', mk: 'US', name: '델 테크놀로지스', won: 759282, vol: 0.005, rate: -1.44, amt: 0.7501 },
  { code: 'LLY', mk: 'US', name: '일라이 릴리', won: 1587958, vol: 0.005, rate: 0.52, amt: 0.7301 },
  { code: 'COHR', mk: 'US', name: '코히런트', won: 377136, vol: 0.005, rate: -1.97, amt: 0.7056 },
  { code: 'BITX', sub: 'ETF', mk: 'US', name: 'BITX', won: 25433, vol: 0.012, rate: -0.31, amt: 0.6697 },
  { code: 'SMR', mk: 'US', name: '뉴스케일파워', won: 8802, vol: 0.01, rate: -1.64, amt: 0.6624 },
  { code: 'ARKG', sub: 'ETF', mk: 'US', name: 'ARKG', won: 65681, vol: 0.005, rate: -0.62, amt: 0.644 },
  { code: 'SPYI', sub: 'ETF', mk: 'US', name: 'SPYI', won: 72213, vol: 0.002, rate: -0.07, amt: 0.6323 },
  { code: 'MSTR', mk: 'US', name: '스트래티지', won: 201866, vol: 0.01, rate: -1.02, amt: 0.6112 },
  { code: 'O', mk: 'US', name: '리얼티 인컴', won: 73268, vol: 0.002, rate: 0.27, amt: 0.5943 },
  { code: 'TLT', sub: 'ETF', mk: 'US', name: 'TLT', won: 104753, vol: 0.002, rate: 0.47, amt: 0.5697 },
  { code: 'SNDU', sub: 'ETF', mk: 'US', name: 'SNDU', won: 23002, vol: 0.012, rate: -7.01, amt: 0.5383 },
  { code: 'CONY', sub: 'ETF', mk: 'US', name: 'CONY', won: 25460, vol: 0.002, rate: -0.1, amt: 0.535 },
  { code: 'SPYM', sub: 'ETF', mk: 'US', name: 'SPYM', won: 122078, vol: 0.002, rate: -0.2, amt: 0.5176 },
  { code: 'RGTI', mk: 'US', name: '리게티 컴퓨팅', won: 17472, vol: 0.01, rate: -1.28, amt: 0.4945 },
  { code: 'WDC', mk: 'US', name: '웨스턴 디지털', won: 499856, vol: 0.005, rate: -3.29, amt: 0.4889 },
  { code: 'GOOG', mk: 'US', name: '알파벳 C', won: 461786, vol: 0.005, rate: -0.93, amt: 0.4765 },
  { code: 'QLDY', sub: 'ETF', mk: 'US', name: 'QLDY', won: 54554, vol: 0.002, rate: -0.02, amt: 0.4762 },
  { code: 'GDXD', sub: 'ETF', mk: 'US', name: 'GDXD', won: 29481, vol: 0.012, rate: 1.84, amt: 0.4761 },
  { code: 'TSLL', sub: 'ETF', mk: 'US', name: 'TSLL', won: 13304, vol: 0.012, rate: -1.87, amt: 0.457 },
  { code: 'JOBY', mk: 'US', name: '조비 에비에이션', won: 6812, vol: 0.01, rate: -0.77, amt: 0.4494 },
  { code: 'NKE', mk: 'US', name: '나이키', won: 47086, vol: 0.005, rate: -0.28, amt: 0.4243 },
  { code: 'ONDS', mk: 'US', name: '온다스', won: 8816, vol: 0.01, rate: -1.04, amt: 0.394 },
  { code: 'NVTS', mk: 'US', name: '나비타스 세미컨덕터', won: 13384, vol: 0.01, rate: 0.3, amt: 0.3775 },
  { code: 'BITU', sub: 'ETF', mk: 'US', name: 'BITU', won: 19689, vol: 0.012, rate: -0.33, amt: 0.3757 },
  { code: 'TSM', mk: 'US', name: 'TSMC(ADR)', won: 590223, vol: 0.005, rate: -0.56, amt: 0.3538 },
  { code: 'HOOD', mk: 'US', name: '로빈후드', won: 144066, vol: 0.005, rate: -1.25, amt: 0.3465 },
  { code: 'MRNY', sub: 'ETF', mk: 'US', name: 'MRNY', won: 55408, vol: 0.002, rate: -0.67, amt: 0.3453 },
  { code: 'MCD', mk: 'US', name: '맥도날드', won: 315382, vol: 0.002, rate: 0.19, amt: 0.3248 },
  { code: 'NVDY', sub: 'ETF', mk: 'US', name: 'NVDY', won: 16457, vol: 0.002, rate: -0.88, amt: 0.3198 },
  { code: 'ARM', mk: 'US', name: 'ARM 홀딩스(ADR)', won: 332614, vol: 0.005, rate: -2.44, amt: 0.312 },
  { code: 'IONX', sub: 'ETF', mk: 'US', name: 'IONX', won: 23897, vol: 0.012, rate: -1.97, amt: 0.3116 },
  { code: 'TLTW', sub: 'ETF', mk: 'US', name: 'TLTW', won: 27036, vol: 0.002, rate: 0.49, amt: 0.3012 },
  { code: 'QCOM', mk: 'US', name: '퀄컴', won: 230265, vol: 0.005, rate: -1.17, amt: 0.2987 },
  { code: 'PFE', mk: 'US', name: '화이자', won: 38016, vol: 0.002, rate: 0.21, amt: 0.2963 },
  { code: 'STX', mk: 'US', name: '씨게이트', won: 982480, vol: 0.005, rate: -2.35, amt: 0.2944 },
  { code: 'GPIQ', sub: 'ETF', mk: 'US', name: 'GPIQ', won: 76995, vol: 0.002, rate: -0.46, amt: 0.2895 },
  { code: 'DXYZ', mk: 'US', name: '데스티니 테크 100', won: 40074, vol: 0.01, rate: -0.95, amt: 0.2844 },
  { code: 'VTI', sub: 'ETF', mk: 'US', name: 'VTI', won: 508726, vol: 0.002, rate: -0.19, amt: 0.2696 },
  { code: 'BMEA', mk: 'US', name: '바이오미아 퓨전', won: 1950, vol: 0.01, rate: 7.35, amt: 0.2639 },
  // 가상의 급등주 (실제 회사 아님). meme: 평소 크게 출렁이고, 가끔 급등 구간 → 급락이 옴
  { code: 'NQHX', mk: 'US', name: '넥서스 퀀텀 홀딩스', price: 1.84, vol: 0.03, rate: 46.03, amt: 0.62, meme: true, fake: true },
  { code: 'ZPHL', mk: 'US', name: '제퍼 바이오 홀딩스', price: 0.87, vol: 0.035, rate: -11.22, amt: 0.41, meme: true, fake: true },
  { code: 'ORBX', mk: 'US', name: '오르빗 스페이스 홀딩스', price: 3.12, vol: 0.025, rate: 8.71, amt: 0.35, meme: true, fake: true },
  // 가상의 극단 급등주: 한 번 붙으면 몇 배로 치솟고, 거의 항상 그대로 무너짐
  { code: 'HYNV', mk: 'US', name: '하이퍼노바 AI 홀딩스', price: 2.47, vol: 0.04, rate: 132.08, amt: 0.88, meme: 'extreme', fake: true },
  { code: 'CLNH', mk: 'US', name: '크립토루나 홀딩스', price: 0.53, vol: 0.045, rate: 38.42, amt: 0.57, meme: 'extreme', fake: true },
  { code: 'BLZH', mk: 'US', name: '블레이즈 에너지 홀딩스', price: 4.06, vol: 0.035, rate: -24.6, amt: 0.49, meme: 'extreme', fake: true },
  { code: 'QLKB', mk: 'US', name: '퀀텀레이크 바이오 홀딩스', price: 1.19, vol: 0.04, rate: 71.5, amt: 0.66, meme: 'extreme', fake: true },
  // 가상의 국내 대형주 (JH증권 계열). 거래대금 24.5억 → 국내 거래대금 10위 안팎에서 시작
  { code: '999550', mk: 'KR', name: 'JH전자', price: 87400, vol: 0.006, rate: 3.24, amt: 24.5, fake: true },
  { code: '999660', mk: 'KR', name: '청운바이오', price: 4185, vol: 0.004, rate: 4.2, amt: 1.3, swing: true, fake: true, logo: 'icons/cwu.png' },
  { code: '999710', mk: 'KR', name: '뉴워트', price: 150200, vol: 0.005, rate: 1.21, amt: 4.6, fake: true, logo: 'icons/newert.png' },
  { code: '999720', mk: 'KR', name: '행복한 다람쥐단', price: 200500, vol: 0.005, rate: 0.85, amt: 3.9, fake: true, logo: 'icons/squirrel.png' },
  { code: '999730', mk: 'KR', name: '모이다', price: 180300, vol: 0.005, rate: -0.66, amt: 3.2, fake: true, logo: 'icons/moida.png' },
  { code: '999740', mk: 'KR', name: '포켓몬스터', price: 96300, vol: 0.005, rate: 1.48, amt: 5.2, fake: true, logo: 'icons/pokeball.png' },
  { code: '999750', mk: 'KR', name: '배틀그라운드', price: 284500, vol: 0.006, rate: -0.92, amt: 6.8, fake: true, logo: 'icons/pubg.png' },
  { code: '999760', mk: 'KR', name: '라이엇 게임즈', price: 132700, vol: 0.005, rate: 2.15, amt: 4.1, fake: true, logo: 'icons/riot.png' },
  // 가상의 청운 계열 일반 종목
  { code: '999670', mk: 'KR', name: '청운건설', price: 12850, vol: 0.005, rate: -1.15, amt: 2.1, fake: true, logo: 'icons/cwu.png' },
  { code: '999680', mk: 'KR', name: '청운화학', price: 38400, vol: 0.004, rate: 0.79, amt: 3.4, fake: true, logo: 'icons/cwu.png' },
  { code: '999690', mk: 'KR', name: '청운식품', price: 7620, vol: 0.004, rate: 0.53, amt: 0.9, fake: true, logo: 'icons/cwu.png' },
  { code: '999700', mk: 'KR', name: '청운에너지', price: 21300, vol: 0.006, rate: -2.07, amt: 1.8, fake: true, logo: 'icons/cwu.png' }, // swing: +30% ~ −30% 사이를 계속 오르내림
  // 가상의 고배율 레버리지 ETF: 기초 종목(track)이 움직인 비율 × lev 만큼 움직임. 시작 등락률도 기초 종목 × 배수
  { code: 'NQTX', sub: 'ETF', mk: 'US', name: 'JH 나스닥100 10배 ETF', price: 13.85, vol: 0.03, rate: -29.4, amt: 0.72, track: 'QQQ', lev: 10, wild: true, fake: true }, // wild: 상승장·하락장이 크게 얹힘
  { code: 'SPFV', sub: 'ETF', mk: 'US', name: 'JH S&P500 5배 ETF', price: 42.15, vol: 0.01, rate: -0.75, amt: 0.38, track: 'VOO', lev: 5, fake: true },
  { code: 'NVDT', sub: 'ETF', mk: 'US', name: 'JH 엔비디아 3배 ETF', price: 61.30, vol: 0.018, rate: -2.94, amt: 0.55, track: 'NVDA', lev: 3, fake: true },
];
// 원화로 받은 해외 가격은 달러로 환산
for (const s of STOCKS) if (s.won) s.price = Math.round(s.won / FX * 100) / 100;

// 전 종목 목록(stocks-data.js) 합치기: 위에서 직접 넣은 종목은 그대로 두고, 나머지를 "가벼운 종목(lite)"으로 추가
//  - lite 종목은 차트 기록을 처음 볼 때 만들고, 내가 본·보유·주문한 종목만 저장 (저장 공간 절약)
const CAT = window.CATALOG || { kr: [], us: [] };
{
  const codes = new Set(STOCKS.map(s => s.code)), names = new Set(STOCKS.filter(s => s.mk === 'KR').map(s => s.name));
  const krCat = new Map(CAT.kr.map(r => [r[0], r])), usCat = new Map(CAT.us.map(r => [r[0], r]));
  // 코드를 몰라 임시 코드(KX-SEMI2X 등)로 넣었던 국내 종목은 이름으로 실제 코드를 찾아 로고에 사용
  const krByName = new Map(CAT.kr.map(r => [r[1].replace(/\s+/g, ''), r[0]]));
  for (const s of STOCKS) if (s.mk === 'KR' && !/^\d{6}$/.test(s.code)) s.logoCode = krByName.get(s.name.replace(/\s+/g, ''));
  const skh = STOCKS.find(s => s.code === 'SKH-ADR'); if (skh) skh.logoCode = '000660'; // SK하이닉스 ADR → SK하이닉스 로고
  for (const s of STOCKS) {
    const r = s.mk === 'US' ? usCat.get(s.code) : krCat.get(s.code);
    if (!r) continue;
    if (s.mk === 'US') { s.rc = r[6]; s.eng = r[2]; } // 네이버 로고·영어 이름 검색용
    // 제가 추정해서 넣었던 가격(rate 없음)은 실제 시세로 교체
    if (s.rate == null) { s.price = r[s.mk === 'US' ? 3 : 2]; s.rate = r[s.mk === 'US' ? 4 : 3]; }
  }
  for (const [code, name, price, rate, tv, kind, mkt] of CAT.kr) {
    if (codes.has(code) || names.has(name)) continue;
    const etf = kind !== 's';
    STOCKS.push({ code, mk: 'KR', name, price, rate, tv, lite: true, sub: etf ? (kind === 'f' ? 'ETF' : 'ETN') : undefined, market: mkt === 'Q' ? '코스닥' : '코스피',
      vol: etf ? 0.004 : price < 5000 ? 0.009 : 0.006 });
  }
  for (const [code, name, eng, price, rate, tv, rc, mkt] of CAT.us) {
    if (codes.has(code)) continue;
    STOCKS.push({ code, mk: 'US', name, eng, price, rate, tv, rc, lite: true, market: { N: '나스닥', Y: '뉴욕', A: '아멕스' }[mkt],
      vol: price < 10 ? 0.01 : 0.005 });
  }
}
const START_CASH = 100_000_000;
const HIST_LEN = 120;
const RANK_MAX = 100;
const KEY = 'mock-stock-v2';

const BY_CODE = new Map(STOCKS.map(s => [s.code, s]));
const info = code => BY_CODE.get(code);
const isUS = code => info(code).mk === 'US';
// 국내는 호가 단위로, 해외는 센트 단위로 맞춤 (tickSize는 아래 호가 부분)
// 해외: $1 이상은 센트, $1 미만은 $0.0001 단위 (싼 종목도 조금씩 움직이도록)
const usRound = v => (v < 1 ? Math.round(v * 10000) / 10000 : Math.round(v * 100) / 100);
const round = (code, v) => (isUS(code) ? Math.max(0.0001, usRound(v)) : Math.max(1, Math.round(v / tickSize(code, v)) * tickSize(code, v)));
const toKRW = (code, v) => (isUS(code) ? v * FX : v);
const won = n => Math.round(n).toLocaleString('ko-KR') + '원';
// 1.23억 / 4,560만 / 9,800원 처럼 짧게
function shortWon(n) {
  const a = Math.abs(n), sign = n < 0 ? '-' : '';
  if (a >= 1e8) return sign + (a / 1e8).toFixed(a >= 1e10 ? 0 : 2) + '억';
  if (a >= 1e4) return sign + Math.round(a / 1e4).toLocaleString('ko-KR') + '만';
  return won(n);
}
const px = (code, v) => (isUS(code)
  ? '$' + v.toLocaleString('en-US', { minimumFractionDigits: v < 1 ? 4 : 2, maximumFractionDigits: v < 1 ? 4 : 2 })
  : won(v));
const pct = n => (n > 0 ? '+' : '') + n.toFixed(2) + '%';
const cls = n => (n > 0 ? 'up' : n < 0 ? 'down' : '');
const $ = id => document.getElementById(id);
// 큰 금액/수량을 조·억·만 단위로
function bigNum(n, unit) {
  if (n >= 1e12) return (n / 1e12).toFixed(1) + '조' + unit;
  if (n >= 1e9) return Math.round(n / 1e8).toLocaleString('ko-KR') + '억' + unit;
  if (n >= 1e8) return (n / 1e8).toFixed(1) + '억' + unit;
  if (n >= 1e4) return Math.round(n / 1e4).toLocaleString('ko-KR') + '만' + unit;
  return Math.round(n).toLocaleString('ko-KR') + unit;
}

function fresh() {
  return { cash: START_CASH, startCash: START_CASH, holdings: {},trades: [], prices: {}, volume: {}, sel: STOCKS[0].code,
    tab: 'ALL', sort: 'amount', page: 'browse', recent: [], orders: [], realized: [] };
}

let state;
try { state = JSON.parse(localStorage.getItem(KEY)); } catch { state = null; }
if (!state || !state.prices) state = fresh();
state.page ||= 'browse';
state.sort ||= 'amount';
state.recent ||= [];
state.realized ||= []; // 판매 수익 기록
state.volume ||= {};
// 기본금이 바뀌면 차액만큼 현금을 맞춰 줌 (보유 주식·거래 내역은 유지)
if (state.startCash !== START_CASH) {
  state.cash += START_CASH - (state.startCash || 10_000_000);
  state.startCash = START_CASH;
}
// 저장: lite 종목은 내가 본(최근 본·선택)·보유·주문한 것만 저장하고 나머지는 다음에 목록 기준가로 다시 시작
function save() {
  try {
    const keep = new Set([state.sel, ...state.recent, ...Object.keys(state.holdings), ...(state.orders || []).map(o => o.code)]);
    const pick = obj => Object.fromEntries(Object.entries(obj).filter(([c]) => { const s = info(c); return s && (!s.lite || keep.has(c)); }));
    // 1분 기록(m)은 내가 본·보유·주문한 종목만, 최근 8시간분만 저장 (나머지는 다음에 다시 만듦)
    const prices = Object.fromEntries(Object.entries(pick(state.prices)).map(([c, p]) =>
      [c, p.m && keep.has(c) ? { ...p, m: p.m.slice(-480) } : { ...p, m: undefined, mt: undefined }]));
    localStorage.setItem(KEY, JSON.stringify({ ...state, prices, volume: pick(state.volume) }));
  } catch {}
}

const last = code => { const h = state.prices[code].hist; return h[h.length - 1]; };
const change = code => (last(code) / state.prices[code].open - 1) * 100;

// 거래량/거래대금 (모의). 가격이 크게 움직일수록 거래가 늘어남
function addVolume(code, r) {
  const v = state.volume[code];
  const amt = v.base * (0.4 + Math.random() * 1.2) * (1 + Math.abs(r) * 60);
  v.shares += Math.max(1, Math.round(amt / toKRW(code, last(code))));
  v.amount += amt;
}
const DATA_VER = 8; // 시작 데이터가 바뀌면 올림 → 시세/거래량만 새로 시작 (자산은 유지)
if (state.dataVer !== DATA_VER) { state.prices = {}; state.volume = {}; state.dataVer = DATA_VER; }
// 종목별 초기값 (새 종목이 추가돼도 기존 저장 데이터는 유지)
// 처음부터 등락이 보이도록 장 시작 후 흐름을 미리 만들어 둠
// open 에서 출발해 end 에서 끝나는 그럴듯한 흐름 N개
function makeHist(s, open, end, N = 80) {
  const min = isUS(s.code) ? 0.0001 : 1;
  const walk = [0];
  for (let i = 1; i < N; i++) walk.push(walk[i - 1] + (Math.random() - 0.5) * 2 * s.vol);
  const hist = walk.map((w, i) => {
    const t = i / (N - 1);
    const base = open * Math.pow(end / open, t);
    return Math.max(min, round(s.code, base * (1 + w - t * walk[N - 1])));
  });
  hist[N - 1] = end; // 현재가는 반올림 없이 그대로 (토스 가격이 호가 단위표보다 잘게 나뉜 경우가 있음)
  return hist;
}
function initStock(s) {
  if (!state.prices[s.code]) {
    let open, end;
    if (s.rate != null) {
      // 실제 등락률: 전일 종가에서 출발해 현재가에서 끝나는 흐름
      open = s.price / (1 + s.rate / 100);
      end = s.price;
    } else {
      // 종목마다 오늘의 방향(추세)을 다르게
      open = s.price;
      end = round(s.code, s.price * (1 + (Math.random() - 0.5) * s.vol * 0.25 * 80));
    }
    // lite 종목은 현재가만 들고 있다가, 화면에 보일 때 흐름을 만듦 (ensureHist)
    state.prices[s.code] = s.lite ? { open, hist: [end], lite: true } : { open, hist: makeHist(s, open, end) };
  }
  if (!state.volume[s.code]) {
    // 실제 거래대금(억원)으로 시작. 순위 밖 종목은 국내 100위(2.1억), 해외 100위(0.26억)보다 적게
    // lite 종목은 실제 시장 거래대금을 토스 규모로 줄이고, 순위 밖 범위 안에서 많고 적음의 순서를 유지
    const cut = s.mk === 'US' ? 0.25 : 2.0, x = (s.tv || 0) * 0.0128;
    const amount = (s.amt != null ? s.amt : s.lite ? cut * 0.95 * x / (x + cut)
      : s.mk === 'US' ? 0.05 + Math.random() * 0.2 : 0.3 + Math.random() * 1.7) * 1e8;
    state.volume[s.code] = {
      base: amount / 1500,
      amount,
      shares: Math.round(amount / toKRW(s.code, s.price)),
    };
  }
}
STOCKS.forEach(initStock);
// lite 종목의 차트용 흐름: 처음 볼 때 전일 종가 → 지금까지 만든 뒤, 그동안 쌓인 시세를 이어 붙임
function ensureHist(code) {
  const p = state.prices[code];
  if (!p.lite) return;
  const s = info(code), first = p.hist[0];
  p.hist = [...makeHist(s, p.open, first, Math.max(2, 81 - p.hist.length)).slice(0, -1), ...p.hist].slice(-HIST_LEN);
  delete p.lite;
}

// 가격 변동: 랜덤 워크 + 가끔 뉴스 이벤트
const NEWS_UP = ['신제품 발표 호평', '대규모 수주 소식', '실적 예상치 상회', '목표주가 상향'];
const NEWS_DOWN = ['실적 부진 우려', '목표주가 하향', '경쟁 심화 우려', '규제 리스크 부각'];
// 급등주 이벤트: 조용하다가 2~4분마다 아래 중 하나가 일어남
//  - climb : 틱마다 +0.8~2%씩 20~40번 → 서서히 +30~120%
//  - bleed : 틱마다 −1~1.8%씩 20~35번 → 서서히 −25~45%
//  - rocket: 순식간에 폭등(극단 +6~14%, 일반 +3~6%씩 6~12번) → 끝나면 높은 확률로 crash(폭락)
const MEME = {
  normal:  { start: 0.02,  mix: [['climb', 0.45], ['bleed', 0.45], ['rocket', 0.10]], rocket: [0.03, 0.03], crash: [0.03, 0.03], after: 0.7 },
  extreme: { start: 0.025, mix: [['climb', 0.38], ['bleed', 0.37], ['rocket', 0.25]], rocket: [0.06, 0.08], crash: [0.07, 0.08], after: 0.9 },
};
const pick = ([base, range]) => base + Math.random() * range;
const meme = {}; // code -> { mode, left, drift }
function memeEvent(s, mode, P) {
  const E = {
    climb:  { left: pick([20, 20]), drift: pick([0.008, 0.012]), say: `📈 [${s.name}] 매수세 유입, 꾸준히 오르는 중` },
    bleed:  { left: pick([20, 15]), drift: -pick([0.01, 0.008]), say: `📉 [${s.name}] 매도세 지속, 서서히 밀리는 중` },
    rocket: { left: pick([6, 6]),   drift: pick(P.rocket),        say: s.meme === 'extreme' ? `🚀🚀 [${s.name}] 폭등 시작!!` : `🚀 [${s.name}] 급등 시작!` },
    crash:  { left: pick([5, 5]),   drift: -pick(P.crash),        say: `💥 [${s.name}] 폭락! 매물 폭탄` },
  }[mode];
  meme[s.code] = { mode, left: Math.floor(E.left), drift: E.drift };
  // (급등·급락 알림은 띄우지 않음)
}
function memeDrift(s) {
  const P = MEME[s.meme === 'extreme' ? 'extreme' : 'normal'];
  const m = meme[s.code];
  if (m) {
    if (--m.left <= 0) {
      delete meme[s.code];
      if (m.mode === 'rocket' && Math.random() < P.after) memeEvent(s, 'crash', P);
    }
    return m.drift;
  }
  if (Math.random() < P.start) {
    let x = Math.random();
    const mode = P.mix.find(([, w]) => (x -= w) < 0)[0];
    memeEvent(s, mode, P);
  }
  return 0;
}

// 초고변동(wild) 종목: 2~6분씩 이어지는 상승장/하락장이 얹힘
//  - 0% 근처(±15%)에서는 가던 방향을 유지해 급상승·급하락 순위 위쪽에 머물게 하고
//  - +80% 넘거나 −60% 밑이면 반대로 꺾음
const wild = {}; // code -> { up, left, drift }
function wildDrift(s) {
  let w = wild[s.code];
  if (!w || --w.left <= 0) {
    const ch = change(s.code);
    let up = Math.random() < 0.5;
    if (ch > 80) up = false;
    else if (ch < -60) up = true;
    else if (w && Math.abs(ch) < 15) up = w.up;
    w = wild[s.code] = { up, left: 30 + Math.floor(Math.random() * 60), drift: 0.008 + Math.random() * 0.012 };
  }
  return (w.up ? 1 : -1) * w.drift * (0.4 + Math.random() * 1.2);
}

// 왕복(swing) 종목: +25~30%까지 오르면 −25~30%를 향해 내려가고, 거기 닿으면 다시 올라감 (±30% 밖으로는 안 나감)
const swing = {}; // code -> { target, drift }
function swingDrift(s) {
  const ch = change(s.code);
  let w = swing[s.code];
  if (!w || (w.target > 0 ? ch >= w.target : ch <= w.target)) {
    const up = w ? w.target < 0 : ch < 0;
    w = swing[s.code] = { target: (up ? 1 : -1) * (25 + Math.random() * 5), drift: 0.005 + Math.random() * 0.005 };
  }
  let r = (w.target > 0 ? 1 : -1) * w.drift * (0.3 + Math.random() * 1.4);
  // 상한가·하한가처럼 시가 대비 ±30%를 넘지 않게 자름
  const open = state.prices[s.code].open, cur = last(s.code);
  return Math.min(open * 1.3 / cur - 1, Math.max(open * 0.7 / cur - 1, r));
}

function step(s) {
  // 가상 고배율 ETF: 이번에 기초 종목이 움직인 비율 × 배수 (+ 아주 작은 괴리)
  if (s.track) {
    const u = state.prices[s.track].hist, ur = u.length > 1 ? u[u.length - 1] / u[u.length - 2] - 1 : 0;
    const r = s.lev * ur + (Math.random() - 0.5) * 0.001 + (s.wild ? wildDrift(s) : 0);
    const h = state.prices[s.code].hist;
    h.push(Math.max(0.0001, round(s.code, last(s.code) * Math.max(0.01, 1 + r))));
    if (h.length > HIST_LEN) h.shift();
    recordMinute(s.code);
    addVolume(s.code, r);
    return;
  }
  // 2배 ETF는 1.25배, 3배 ETF는 1.5배 더 크게 움직임
  const boost = { 1: 1, 2: 1.25, 3: 1.5 }[levOf(s.code)] || 1;
  let r = (Math.random() - 0.5) * 2 * s.vol * boost;
  if (!s.lite && Math.random() < 0.0015) { // 뉴스 알림은 직접 넣은 종목만 (종목이 많아 알림이 넘치지 않게)
    const good = Math.random() < 0.5;
    r += (good ? 1 : -1) * (0.02 + Math.random() * 0.03);
    // (뉴스 알림은 띄우지 않고 가격에만 반영)
  }
  if (s.meme) r += memeDrift(s);
  if (s.swing) r = swingDrift(s) + (Math.random() - 0.5) * s.vol;
  const h = state.prices[s.code].hist;
  h.push(Math.max(isUS(s.code) ? 0.0001 : 1, round(s.code, last(s.code) * (1 + r))));
  if (h.length > HIST_LEN) h.shift();
  recordMinute(s.code);
  addVolume(s.code, r);
}

// 1분 기록: 종목마다 [시가, 고가, 저가, 종가] 1분봉을 쌓음 (차트의 1분·10분·1시간·전체 보기용)
//  - 처음 볼 때 장 시작(전일 종가)부터 지금까지 6시간분을 만들어 두고, 이후로는 실제 움직임대로 쌓임
const MIN_KEEP = 1440, nowMin = () => Math.floor(Date.now() / 60000);
function recordMinute(code) {
  const p = state.prices[code];
  if (!p.m) return;
  const v = last(code), t = nowMin();
  if (p.mt !== t) {
    const o = p.m.length ? p.m[p.m.length - 1][3] : v;
    p.m.push([o, Math.max(o, v), Math.min(o, v), v]);
    p.mt = t;
    if (p.m.length > MIN_KEEP) p.m.shift();
  } else {
    const b = p.m[p.m.length - 1];
    b[1] = Math.max(b[1], v); b[2] = Math.min(b[2], v); b[3] = v;
  }
}
function ensureMinutes(code) {
  ensureHist(code);
  const p = state.prices[code];
  if (p.m && p.m.length) return;
  const s = info(code), N = 360;
  // 1분은 시세 약 15번이라 한 칸 변동폭을 크게
  const closes = makeHist({ ...s, vol: s.vol * 3 }, p.open, last(code), N + 1);
  p.m = [];
  for (let i = 1; i <= N; i++) {
    const o = i === 1 ? p.open : closes[i - 1], c = closes[i], wig = Math.abs(c - o) * 0.6 + o * s.vol * 1.5;
    p.m.push([o, round(code, Math.max(o, c) + wig * Math.random()), round(code, Math.max(0.0001, Math.min(o, c) - wig * Math.random())), c]);
  }
  p.mt = nowMin();
}
// 호가 (모의). 호가 단위는 한국거래소 규칙, 해외는 $0.01
const BOOK_LV = 7;
function tickSize(code, p) {
  if (isUS(code)) return p < 1 ? 0.0001 : 0.01;
  const s = info(code);
  if (s.sub === 'ETF' || s.sub === 'ETN' || /^(KODEX|TIGER|SOL|RISE)/.test(s.name)) return p < 2000 ? 1 : 5;
  return p < 2000 ? 1 : p < 5000 ? 5 : p < 20000 ? 10 : p < 50000 ? 50 : p < 200000 ? 100 : p < 500000 ? 500 : 1000;
}
const snap = (code, v) => (isUS(code) ? usRound(v) : v);
const books = {}; // code -> { ask: [잔량], bid: [잔량] } (가까운 호가부터)
function bookQty(code) {
  // 호가 한 칸 잔량 기준: 오늘 거래대금의 0.3% 정도를 주식 수로 (최소 수십 주)
  const base = Math.max(30 + Math.random() * 60, state.volume[code].amount * 0.003 / toKRW(code, last(code)));
  const one = i => Math.max(1, Math.round(base * (0.3 + Math.random()) * (1 + i * 0.15)));
  return books[code] ||= { ask: Array.from({ length: BOOK_LV }, (_, i) => one(i)), bid: Array.from({ length: BOOK_LV }, (_, i) => one(i)) };
}
function shakeBook(code) {
  const b = books[code];
  if (!b) return;
  for (const side of ['ask', 'bid'])
    b[side] = b[side].map(q => Math.max(1, Math.round(q * (0.75 + Math.random() * 0.5))));
}
function renderBook() {
  const c = state.sel, p = last(c), t = tickSize(c, p), b = bookQty(c), open = state.prices[c].open;
  // 현재가가 매도 1호가, 바로 아래가 매수 1호가
  const ask1 = Math.ceil(p / t - 1e-9) * t;
  const asks = b.ask.map((q, i) => ({ px: snap(c, ask1 + i * t), q })).reverse();
  const bids = b.bid.map((q, i) => ({ px: snap(c, ask1 - (i + 1) * t), q })).filter(r => r.px > 0);
  const max = Math.max(...b.ask, ...b.bid);
  const row = (r, side) => {
    const ch = (r.px / open - 1) * 100, w = Math.round((r.q / max) * 100);
    const qty = `<span class="q"><i style="width:${w}%"></i><b>${r.q.toLocaleString('ko-KR')}</b></span>`;
    // 이 가격에 걸어 둔 내 미체결 주문 표시
    const my = state.orders.filter(o => o.code === c && o.price === r.px);
    const tag = my.length ? `<em class="my ${my[0].side}">내 ${my[0].side === 'buy' ? '매수' : '매도'} ${my.reduce((a, o) => a + o.n, 0)}</em>` : '';
    return `<div class="br ${side}${r.px === ask1 ? ' cur' : ''}${my.length ? ' has-order' : ''}" data-px="${r.px}">${tag}
      ${side === 'ask' ? qty : '<span></span>'}
      <span class="bp ${cls(ch)}">${px(c, r.px).replace('원', '')}<small>${pct(ch)}</small></span>
      ${side === 'bid' ? qty : '<span></span>'}
    </div>`;
  };
  $('book').innerHTML = asks.map(r => row(r, 'ask')).join('') + bids.map(r => row(r, 'bid')).join('');
  const sum = a => a.reduce((x, y) => x + y, 0).toLocaleString('ko-KR');
  $('ask-total').textContent = `매도잔량 ${sum(b.ask)}`;
  $('bid-total').textContent = `매수잔량 ${sum(b.bid)}`;
}

function tick() {
  STOCKS.forEach(step);
  fillOrders();
  shakeBook(state.sel);
  save();
  render();
  setTimeout(tick, 3000 + Math.random() * 2000); // 3~5초 간격
}

// 주문 (지정가)
//  - 매수: 주문가 ≥ 현재가면 현재가로 바로 체결, 아니면 미체결로 걸어 두고 현재가가 주문가 이하로 오면 주문가로 체결
//  - 매도: 주문가 ≤ 현재가면 현재가로 바로 체결, 아니면 현재가가 주문가 이상으로 오면 주문가로 체결
//  - 미체결 매수 금액은 현금에서 미리 빼 두고(취소하면 돌려줌), 미체결 매도 수량은 팔 수 있는 수량에서 빠짐
state.orders ||= [];
const heldQty = code => (state.holdings[code] ? state.holdings[code].qty : 0);
const pendingSell = code => state.orders.filter(o => o.side === 'sell' && o.code === code).reduce((a, o) => a + o.n, 0);
const sellable = code => heldQty(code) - pendingSell(code);
const reservedCash = () => state.orders.filter(o => o.side === 'buy').reduce((a, o) => a + toKRW(o.code, o.price) * o.n, 0);
const maxBuy = (code, price = last(code)) => Math.floor(state.cash / toKRW(code, price));

// 실제 체결: 보유 수량·평균가·거래 내역 반영 (매수 대금은 호출하는 쪽에서 처리)
function fill(side, code, n, p) {
  const h = state.holdings[code] || { qty: 0, avg: 0 };
  if (side === 'buy') {
    h.avg = (h.avg * h.qty + p * n) / (h.qty + n);
    h.qty += n;
  } else {
    // 판매 수익 = (판 가격 − 평균 매입가) × 수량, 원화 기준
    if (h.avg > 0) {
      state.realized.unshift({ t: Date.now(), code, name: info(code).name, mk: info(code).mk, n,
        pnl: toKRW(code, p - h.avg) * n, cost: toKRW(code, h.avg) * n });
      state.realized = state.realized.slice(0, 300);
    }
    h.qty -= n;
    state.cash += toKRW(code, p) * n;
  }
  if (h.qty > 0) state.holdings[code] = h; else delete state.holdings[code];
  state.trades.unshift({ t: Date.now(), side, code, name: info(code).name, n, p });
  state.trades = state.trades.slice(0, 100);
}

// 주문 접수. 실패하면 오류 문구를 돌려줌
function placeOrder(side, code, n, price) {
  const name = info(code).name, cur = last(code), label = side === 'buy' ? '매수' : '매도';
  if (!(n >= 1)) return '수량을 1 이상 입력하세요.';
  if (!(price > 0)) return '가격을 입력하세요.';
  if (side === 'buy') {
    if (toKRW(code, price) * n > state.cash) return `현금이 부족합니다. (이 가격에 최대 ${maxBuy(code, price)}주)`;
    if (price >= cur) {
      state.cash -= toKRW(code, cur) * n;
      fill('buy', code, n, cur);
      done(`✅ ${name} ${n}주 매수 체결 (${px(code, cur)})`);
    } else {
      state.cash -= toKRW(code, price) * n;
      state.orders.push({ id: Date.now() + Math.random(), side, code, n, price, t: Date.now() });
      done(`📝 ${name} ${n}주 ${px(code, price)} 매수 주문 접수 · 가격이 오면 체결됩니다`);
    }
  } else {
    if (n > sellable(code)) {
      const p = pendingSell(code);
      return heldQty(code) === 0 ? '보유한 주식이 없습니다.'
        : `팔 수 있는 수량은 ${sellable(code)}주입니다.${p ? ` (미체결 매도 ${p}주)` : ''}`;
    }
    if (price <= cur) {
      fill('sell', code, n, cur);
      done(`✅ ${name} ${n}주 매도 체결 (${px(code, cur)})`);
    } else {
      state.orders.push({ id: Date.now() + Math.random(), side, code, n, price, t: Date.now() });
      done(`📝 ${name} ${n}주 ${px(code, price)} 매도 주문 접수 · 가격이 오면 체결됩니다`);
    }
  }
  save();
  render();
  return null;
}

// 시세가 움직일 때마다 미체결 주문 확인
function fillOrders() {
  state.orders = state.orders.filter(o => {
    const cur = last(o.code);
    const hit = o.side === 'buy' ? cur <= o.price : cur >= o.price;
    if (!hit) return true;
    fill(o.side, o.code, o.n, o.price); // 매수 대금은 주문할 때 이미 빼 둠
    toast(`✅ ${info(o.code).name} ${o.n}주 ${o.side === 'buy' ? '매수' : '매도'} 체결 (${px(o.code, o.price)})`);
    return false;
  });
}

function cancelOrder(id) {
  const o = state.orders.find(x => x.id === id);
  if (!o) return;
  if (o.side === 'buy') state.cash += toKRW(o.code, o.price) * o.n;
  state.orders = state.orders.filter(x => x.id !== id);
  msg(`${info(o.code).name} ${o.side === 'buy' ? '매수' : '매도'} 주문을 취소했습니다.`);
  save();
  render();
}

function ordersHTML(list) {
  return list.map(o => `<li>
      <span><b class="${o.side === 'buy' ? 'up' : 'down'}">${o.side === 'buy' ? '매수' : '매도'}</b> ${info(o.code).name}
        <small class="muted">${o.n}주 · ${px(o.code, o.price)}</small></span>
      <span class="o-btns"><button class="cancel-btn" data-edit="${o.id}">수정</button><button class="cancel-btn" data-cancel="${o.id}">취소</button></span>
    </li>`).join('');
}

// 미체결 주문 수정: 그 주문의 가격·수량이 채워진 주문 창을 열고, 내면 원래 주문을 바꿔 줌
function editOrder(id) {
  const o = state.orders.find(x => x.id === id);
  if (!o) return;
  openOrder(o.side, o.price, o.code, o);
}

// 주문 창
let order = null; // { side, code, edit? }
const moQty = () => Math.floor(Number($('mo-qty').value) || 0);
const moPrice = () => { const v = Number($('mo-px').value); return v > 0 ? round(order.code, v) : 0; };
// 주문 수정 중이면 그 주문에 묶인 현금·수량은 돌려받는 것으로 보고 계산
const moCash = () => state.cash + (order.edit?.side === 'buy' ? toKRW(order.edit.code, order.edit.price) * order.edit.n : 0);
const moSellable = () => sellable(order.code) + (order.edit?.side === 'sell' ? order.edit.n : 0);
const moMaxBuy = p => Math.floor(moCash() / toKRW(order.code, p));
function openOrder(side, price, code = state.sel, edit = null) {
  order = { side, code, edit };
  $('mo-px').value = price ?? last(code);
  $('mo-px').step = isUS(code) ? (last(code) < 1 ? '0.0001' : '0.01') : '1';
  $('mo-qty').value = edit ? edit.n : 1;
  $('mo-err').textContent = '';
  $('modal').hidden = false;
  // 폰에서는 자동으로 키보드가 올라와 창을 가리므로 PC에서만 바로 입력 상태로
  if (!isPhone()) { $('mo-qty').focus(); $('mo-qty').select(); }
  renderOrder();
}
function setSide(side) { if (order) { order.side = side; $('mo-err').textContent = ''; renderOrder(); } }
function closeOrder() { order = null; $('modal').hidden = true; }
function renderOrder() {
  if (!order) return;
  const { side, code } = order, buy = side === 'buy', cur = last(code), p = moPrice(), n = moQty();
  const krw = toKRW(code, p) * n;
  $('modal').className = 'modal ' + (buy ? 'is-buy' : 'is-sell');
  document.querySelectorAll('.mo-side button').forEach(b => b.classList.toggle('on', b.dataset.side === side));
  const ed = order.edit;
  $('mo-title').textContent = info(code).name + (ed ? ' 주문 수정' : '');
  // 실시간 현재가: 값이 바뀌면 오르면 빨강, 내리면 파랑으로 잠깐 깜빡임
  const ch = change(code), curEl = $('mo-cur');
  let flash = '';
  if (order.shown !== undefined && order.shown !== cur) {
    flash = cur > order.shown ? ' flash-up' : ' flash-down';
    curEl.className = '';
    void curEl.offsetWidth; // 애니메이션 다시 시작
  } else flash = curEl.className.match(/ flash-(up|down)/)?.[0] || '';
  order.shown = cur;
  curEl.textContent = px(code, cur);
  curEl.className = cls(ch) + flash;
  $('mo-chg').textContent = pct(ch);
  $('mo-chg').className = cls(ch);
  $('mo-price').textContent = [isUS(code) ? `환율 ${FX.toLocaleString('ko-KR')}원` : '', ed ? `원래 주문 ${ed.n}주 ${px(code, ed.price)}` : '']
    .filter(Boolean).join(' · ');
  $('mo-unit').textContent = isUS(code) ? '$' : '원';
  $('mo-max').textContent = buy ? '최대 매수' : '전부 매도';
  $('mo-ok').textContent = ed ? '수정하기' : buy ? '매수 주문' : '매도 주문';
  document.querySelector('.mo-side').hidden = !!ed; // 수정할 때는 매수/매도 방향은 그대로
  // 바로 체결되는지, 언제 체결되는지 안내
  const now = buy ? p >= cur : p <= cur;
  $('mo-hint').textContent = !p ? '' : now
    ? `현재가 ${px(code, cur)}에 바로 체결됩니다.`
    : `현재가가 ${px(code, p)} ${buy ? '이하로 내려오면' : '이상으로 오르면'} 체결됩니다.`;
  $('mo-hint').className = 'mo-hint ' + (now ? 'now' : 'wait');
  $('mo-avail').textContent = buy
    ? `이 가격에 최대 ${p ? moMaxBuy(p) : 0}주 (주문 가능 현금 ${won(moCash())})`
    : `팔 수 있는 수량 ${moSellable()}주${pendingSell(code) ? ` (보유 ${heldQty(code)}주 · 미체결 매도 ${pendingSell(code)}주)` : ''}`;
  $('mo-total').textContent = won(krw);
  $('mo-after').textContent = buy ? `주문 후 주문 가능 현금 ${won(moCash() - krw)}` : `체결되면 현금 +${won(krw)}`;
}
function submitOrder() {
  const ed = order.edit;
  if (!ed) {
    const err = placeOrder(order.side, order.code, moQty(), moPrice());
    if (err) $('mo-err').textContent = err; else closeOrder();
    return;
  }
  // 수정: 원래 주문을 잠시 빼고(묶인 현금 돌려받음) 새 조건으로 다시 냄. 실패하면 원래대로 되돌림
  const before = { cash: state.cash, orders: state.orders.slice() };
  if (ed.side === 'buy') state.cash += toKRW(ed.code, ed.price) * ed.n;
  state.orders = state.orders.filter(x => x.id !== ed.id);
  const pending = state.orders.length;
  const err = placeOrder(ed.side, ed.code, moQty(), moPrice());
  if (err) { state.cash = before.cash; state.orders = before.orders; $('mo-err').textContent = err; render(); return; }
  // 수정 가격이 바로 체결 가능한 가격이면 placeOrder 의 "체결" 안내를 그대로 둠
  if (state.orders.length > pending) done(`📝 ${info(ed.code).name} 주문을 수정했습니다. (${moQty()}주 · ${px(ed.code, moPrice())})`);
  closeOrder();
}

let msgTimer;
function msg(text, err) {
  const el = $('msg');
  el.textContent = text;
  el.className = 'msg ' + (err ? 'up' : 'muted');
  clearTimeout(msgTimer);
  msgTimer = setTimeout(() => (el.textContent = ''), 3000);
}
let toastTimer;
// 매수·매도 성공 알림: 화면 아래 알림 + 상세 화면 안내 둘 다
function done(text) { msg(text); toast(text); }
function toast(text) {
  const el = $('toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

// 차트
function draw(canvas, data, color, full) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== w * dpr || canvas.height !== h * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  if (data.length < 2) return;
  const pad = full ? 8 : 2;
  let min = Math.min(...data), max = Math.max(...data);
  if (min === max) { min *= 0.999; max *= 1.001; }
  const x = i => pad + (i / (data.length - 1)) * (w - pad * 2);
  const y = v => pad + (1 - (v - min) / (max - min)) * (h - pad * 2);
  if (full) chartGeom = { n: data.length, x, y, val: i => data[i], sec: typeof full === 'number' ? full : 4, // 짚어 보기용 (sec: 점 하나의 시간)
    seg: i => (i > 0 ? (data[i] / data[i - 1] - 1) * 100 : 0) };
  ctx.beginPath();
  data.forEach((v, i) => (i ? ctx.lineTo(x(i), y(v)) : ctx.moveTo(x(i), y(v))));
  ctx.strokeStyle = color;
  ctx.lineWidth = full ? 2 : 1.5;
  ctx.stroke();
  if (full) {
    ctx.lineTo(x(data.length - 1), h);
    ctx.lineTo(x(0), h);
    ctx.closePath();
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, color + '33');
    g.addColorStop(1, color + '00');
    ctx.fillStyle = g;
    ctx.fill();
  }
}
// 차트 짚어 보기: PC는 마우스를 올리면, 폰은 누른 채로 좌우로 움직이면 그 시점의 가격·등락률 표시
let chartGeom = null, hoverX = null;
function drawCrosshair() {
  const g = chartGeom, cv = $('chart');
  if (!g || hoverX == null || !g.n) return;
  const ctx = cv.getContext('2d'), w = cv.clientWidth, h = cv.clientHeight;
  // 마우스 위치에서 가장 가까운 점(봉)
  let i = 0, best = Infinity;
  for (let k = 0; k < g.n; k++) { const d = Math.abs(g.x(k) - hoverX); if (d < best) { best = d; i = k; } }
  const c = state.sel, v = g.val(i), ch = (v / state.prices[c].open - 1) * 100;
  const cx = g.x(i), cy = g.y(v), col = ch >= 0 ? css('--up') : css('--down');
  ctx.save();
  ctx.strokeStyle = css('--muted'); ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx, cy, 4.5, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = css('--panel'); ctx.lineWidth = 2; ctx.stroke();
  // 라벨: 가격 · 등락률 · 얼마 전 (점·봉 하나의 시간 g.sec 기준)
  const ago = (g.n - 1 - i) * g.sec;
  const when = ago < 5 ? '지금' : ago < 60 ? `${ago}초 전`
    : ago < 3600 ? `${Math.floor(ago / 60)}분 ${ago % 60 ? (ago % 60) + '초 ' : ''}전`
    : `${Math.floor(ago / 3600)}시간 ${Math.floor(ago % 3600 / 60) ? Math.floor(ago % 3600 / 60) + '분 ' : ''}전`;
  // 그 구간 하나에서만 오르내린 % (캔들: 그 봉의 시가→종가, 라인: 앞 점→이 점)
  const seg = g.seg(i), sinceCol = seg >= 0 ? css('--up') : css('--down');
  const t1 = px(c, v), t2 = `전일 대비 ${pct(ch)} · ${when}`, t3 = `${seg > 0 ? '▲' : seg < 0 ? '▼' : '−'} ${Math.abs(seg).toFixed(2)}%`;
  ctx.font = '700 13px sans-serif'; const w1 = ctx.measureText(t1).width;
  ctx.font = '600 12px sans-serif'; const w2 = ctx.measureText(t2).width, w3 = ctx.measureText(t3).width;
  const bw = Math.max(w1, w2, w3) + 20, bh = t3 ? 62 : 44, bx = Math.min(Math.max(cx - bw / 2, 2), w - bw - 2), by = 4;
  ctx.fillStyle = css('--text'); ctx.globalAlpha = 0.92;
  ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, by, bw, bh, 8) : ctx.rect(bx, by, bw, bh); ctx.fill();
  ctx.globalAlpha = 1; ctx.fillStyle = css('--panel'); ctx.textAlign = 'center';
  ctx.font = '700 13px sans-serif'; ctx.fillText(t1, bx + bw / 2, by + 19);
  ctx.fillStyle = col; ctx.font = '600 12px sans-serif'; ctx.fillText(t2, bx + bw / 2, by + 36);
  if (t3) { ctx.fillStyle = sinceCol; ctx.fillText(t3, bx + bw / 2, by + 54); }
  ctx.restore();
}
// 기간 버튼: 실시간(시세 하나하나, 최근 8분) · 1분 · 10분 · 1시간(그 단위로 묶은 점·봉) · 전체(오늘 전부)
const CANDLE_PER = 4;
const tickBars = data => {
  const bars = [];
  for (let i = 0; i < data.length; i += CANDLE_PER) {
    const g = data.slice(Math.max(0, i - 1), i + CANDLE_PER); // 앞 봉의 종가에서 시작
    bars.push({ o: g[0], c: g[g.length - 1], hi: Math.max(...g), lo: Math.min(...g) });
  }
  return bars;
};
// 1분봉 k개씩 묶기 (마지막 봉이 지금 진행 중인 봉이 되도록 뒤에서부터)
function aggBars(m, k) {
  const out = [];
  for (let end = m.length; end > 0; end -= k) {
    const g = m.slice(Math.max(0, end - k), end);
    out.unshift({ o: g[0][0], hi: Math.max(...g.map(b => b[1])), lo: Math.min(...g.map(b => b[2])), c: g[g.length - 1][3] });
  }
  return out;
}
function series(c, tf) {
  const p = state.prices[c];
  if (tf === 'live' || !tf) return { closes: p.hist, sec: 4, bars: tickBars(p.hist), barSec: 4 * CANDLE_PER };
  ensureMinutes(c);
  const m = p.m;
  if (tf === 'all') {
    const k = Math.max(1, Math.ceil(m.length / 48)); // 캔들은 48개 안팎으로
    return { closes: m.map(b => b[3]), sec: 60, bars: aggBars(m, k), barSec: k * 60 };
  }
  const k = { '1m': 1, '10m': 10, '1h': 60 }[tf], show = { '1m': 60, '10m': 48, '1h': 24 }[tf];
  const bars = aggBars(m, k).slice(-show);
  return { closes: bars.map(b => b.c), sec: k * 60, bars, barSec: k * 60 };
}
function redrawChart() {
  const c = state.sel, S = series(c, state.tf);
  if (state.chart === 'candle') drawCandles($('chart'), S.bars, S.barSec);
  else draw($('chart'), S.closes, lineColor(c), S.sec);
  drawCrosshair();
  document.querySelectorAll('.ranges button').forEach(b => b.classList.toggle('on', b.dataset.tf === (state.tf || 'live')));
}

// 캔들 차트: 봉마다 시가·고가·저가·종가 (오르면 빨강, 내리면 파랑)
function drawCandles(canvas, candles, barSec) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== w * dpr || canvas.height !== h * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  if (!candles.length) return;
  const pad = 8;
  let min = Math.min(...candles.map(k => k.lo)), max = Math.max(...candles.map(k => k.hi));
  if (min === max) { min *= 0.999; max *= 1.001; }
  const slot = (w - pad * 2) / candles.length, bw = Math.max(2, slot * 0.62);
  const y = v => pad + (1 - (v - min) / (max - min)) * (h - pad * 2);
  const up = css('--up'), down = css('--down');
  chartGeom = { n: candles.length, x: i => pad + slot * (i + 0.5), y, val: i => candles[i].c, sec: barSec, candles,
    seg: i => (candles[i].c / candles[i].o - 1) * 100 };
  candles.forEach((k, i) => {
    const cx = pad + slot * (i + 0.5), col = k.c >= k.o ? up : down;
    ctx.strokeStyle = ctx.fillStyle = col;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx, y(k.hi)); ctx.lineTo(cx, y(k.lo)); ctx.stroke(); // 꼬리
    const top = y(Math.max(k.o, k.c)), bh = Math.max(1, Math.abs(y(k.o) - y(k.c)));
    ctx.fillRect(cx - bw / 2, top, bw, bh); // 몸통
  });
}
const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const lineColor = code => (change(code) >= 0 ? css('--up') : css('--down'));

// 화면 그리기
// 종목 로고: 토스증권 → 네이버 → (해외) FMP 순으로 시도, 모두 실패하면 토스 스타일 아이콘
const THREE_X = ['KORU', 'SOXL', 'SOXS', 'TQQQ', 'SQQQ', 'TMF', 'GDXU', 'GDXD'];
const TWO_X = ['RAM', 'MUU', 'QLD', 'ETHU', 'ETHD', 'XXRP', 'DRAM', 'SNXX', 'BITX', 'SNDU', 'TSLL', 'BITU', 'IONX'];
// 레버리지 배수 (일반 종목은 1)
function levOf(code) {
  if (info(code).lev) return info(code).lev;
  if (THREE_X.includes(code)) return 3;
  if (TWO_X.includes(code) || /2X|2x|레버리지/.test(info(code).name)) return 2;
  return 1;
}
const INVERSE = ['SOXS', 'SQQQ', 'ETHD', 'GDXD'];
// 가상 종목 전용 로고 (배경 그라데이션 + 흰색 심볼, 32x32 기준)
const FAKE_LOGOS = {
  NQHX: ['#0f2b5b', '#1fb6d6', // 넥서스 퀀텀: 원자 궤도
    `<g fill="none" stroke="#fff" stroke-width="1.7"><ellipse cx="16" cy="16" rx="11.5" ry="4.4"/>
     <ellipse cx="16" cy="16" rx="11.5" ry="4.4" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="11.5" ry="4.4" transform="rotate(120 16 16)"/></g>
     <circle cx="16" cy="16" r="2.8" fill="#8ff6ff"/>`],
  ZPHL: ['#07563f', '#3ddc97', // 제퍼 바이오: DNA 나선
    `<g fill="none" stroke-linecap="round"><path d="M10 3c0 6.5 12 6.5 12 13s-12 6.5-12 13" stroke="#fff" stroke-width="2.4"/>
     <path d="M22 3c0 6.5-12 6.5-12 13s12 6.5 12 13" stroke="#fff" stroke-width="2.4" opacity=".55"/>
     <path d="M12.5 7.5h7M12.5 24.5h7M14.5 16h3" stroke="#fff" stroke-width="1.6" opacity=".85"/></g>`],
  ORBX: ['#160c2e', '#6c3ce0', // 오르빗 스페이스: 고리 달린 행성
    `<circle cx="16" cy="16" r="7.2" fill="#fff"/><path d="M16 8.8a7.2 7.2 0 0 0 0 14.4a9 9 0 0 1 0-14.4z" fill="#c9b8ff" opacity=".7"/>
     <ellipse cx="16" cy="16" rx="13.5" ry="3.8" fill="none" stroke="#fff" stroke-width="1.8" transform="rotate(-22 16 16)"/>
     <circle cx="26" cy="6.5" r="1.3" fill="#fff"/><circle cx="6" cy="25" r=".9" fill="#fff" opacity=".8"/>`],
  HYNV: ['#ff2d87', '#ff9a3c', // 하이퍼노바 AI: 폭발하는 별
    `<path d="M16 2.5l2.7 10.8L29.5 16l-10.8 2.7L16 29.5l-2.7-10.8L2.5 16l10.8-2.7z" fill="#fff"/>
     <path d="M25.5 4l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z" fill="#fff" opacity=".85"/>
     <circle cx="16" cy="16" r="2.2" fill="#ff5a6e"/>`],
  CLNH: ['#140f3a', '#8a5cf6', // 크립토루나: 초승달과 별
    `<path d="M19.5 4.5a11.5 11.5 0 1 0 8 19.5A9.5 9.5 0 0 1 19.5 4.5z" fill="#fff"/>
     <path d="M24 6.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" fill="#ffe27a"/><circle cx="27" cy="15" r="1" fill="#ffe27a"/>`],
  BLZH: ['#c81e1e', '#ff9f1c', // 블레이즈 에너지: 불꽃
    `<path d="M16 2.5c1.8 5 8.5 8.2 8.5 15.5a8.5 8.5 0 0 1-17 0c0-4.3 2.2-6.6 4.3-8.6 0 3.2 1.2 5.2 3.2 5.4-1.2-4.4 0-8.4 1-12.3z" fill="#fff"/>
     <path d="M16 17.5c1.6 2.1 3.3 3.3 3.3 5.4a3.3 3.3 0 0 1-6.6 0c0-2.1 1.7-3.3 3.3-5.4z" fill="#ff8a1c"/>`],
  QLKB: ['#0d47a1', '#26c6da', // 퀀텀레이크 바이오: 물방울과 물결
    `<path d="M16 3.5c4.3 6.2 8.4 10.2 8.4 15.6a8.4 8.4 0 0 1-16.8 0c0-5.4 4.1-9.4 8.4-15.6z" fill="#fff"/>
     <path d="M10 20.5c2-1.6 4-1.6 6 0s4 1.6 6 0" stroke="#1a8fd0" stroke-width="1.9" fill="none" stroke-linecap="round"/>
     <path d="M11 13.5a6 6 0 0 1 3-4" stroke="#1a8fd0" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".5"/>`],
  '999550': ['#3182f6', '#6a3df0', // JH전자: JH증권 색에 반도체 칩 + 번개
    `<rect x="8" y="8" width="16" height="16" rx="3.5" fill="#fff"/>
     <g stroke="#fff" stroke-width="1.6" stroke-linecap="round"><path d="M12 4.5v3M16 4.5v3M20 4.5v3M12 24.5v3M16 24.5v3M20 24.5v3M4.5 12h3M4.5 16h3M4.5 20h3M24.5 12h3M24.5 16h3M24.5 20h3"/></g>
     <path d="M17.2 10.5l-4.6 6.2h3.4l-1.2 4.8 4.6-6.2h-3.4z" fill="#5b5ff0"/>`],
  // 로고 이미지를 구할 수 없는 해외 종목: 업종을 나타내는 심볼로
  SPACEX: ['#05070d', '#2b3550', // 스페이스X: 로켓
    `<path d="M16 3c3.6 3.2 5.2 7.6 5.2 12.6v5.2h-10.4v-5.2C10.8 10.6 12.4 6.2 16 3z" fill="#fff"/>
     <circle cx="16" cy="12.5" r="2" fill="#2b3550"/><path d="M10.8 17.5l-3.3 3.6v3.4l3.3-1.8zM21.2 17.5l3.3 3.6v3.4l-3.3-1.8z" fill="#cfd6e6"/>
     <path d="M13.4 22.5h5.2l-1 4.8h-3.2z" fill="#ff8a3c"/>`],
  WISESAT: ['#0c2340', '#2a7de1', // 와이즈샛 스페이스: 위성
    `<rect x="12.5" y="12.5" width="7" height="7" rx="1.2" fill="#fff" transform="rotate(45 16 16)"/>
     <g fill="#9cc8ff"><rect x="3" y="13.8" width="7" height="4.4" rx=".6" transform="rotate(45 16 16)"/><rect x="22" y="13.8" width="7" height="4.4" rx=".6" transform="rotate(45 16 16)"/></g>
     <path d="M23.5 4.5a6 6 0 0 1 4 4M22.5 7.5a3 3 0 0 1 2 2" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round"/>`],
  'WF-HOLD': ['#3a0d0d', '#d13b3b', // WF 홀딩: 모노그램
    `<path d="M5 9l3 14 3.5-9.5L15 23l3-14" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
     <path d="M20 23V9h7M20 15.5h5.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`],
  STABLEX: ['#0b5d4b', '#22c39a', // 스테이블코인X: 코인
    `<circle cx="16" cy="16" r="11" fill="none" stroke="#fff" stroke-width="2.2"/><circle cx="16" cy="16" r="7.5" fill="#fff" opacity=".18"/>
     <path d="M19.5 12.2c-.8-1.1-2-1.7-3.5-1.7-2 0-3.4 1-3.4 2.6 0 3.6 7.2 2 7.2 5.8 0 1.6-1.5 2.7-3.7 2.7-1.6 0-3-.7-3.8-1.9M16 8.5v15" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`],
  CEREBRAS: ['#1a1030', '#f05a28', // 세레브라스: 칩
    `<rect x="9" y="9" width="14" height="14" rx="2.5" fill="#fff"/><rect x="12.5" y="12.5" width="7" height="7" rx="1" fill="#f05a28"/>
     <g stroke="#fff" stroke-width="1.6" stroke-linecap="round"><path d="M12.5 5v4M16 5v4M19.5 5v4M12.5 23v4M16 23v4M19.5 23v4M5 12.5h4M5 16h4M5 19.5h4M23 12.5h4M23 16h4M23 19.5h4"/></g>`],
};
function badge(code) {
  const art = FAKE_LOGOS[code];
  if (art) return `<span class="lg-badge lg-art" style="background:linear-gradient(135deg, ${art[0]}, ${art[1]})"><svg viewBox="0 0 32 32" aria-hidden="true">${art[2]}</svg></span>`;
  const s = info(code), n = s.name;
  // 기본: 종목마다 다른 색의 은은한 그라데이션
  const hue = [...code].reduce((a, ch) => a + ch.charCodeAt(0) * 7, 0) % 360;
  let color = `linear-gradient(135deg, hsl(${hue} 55% 38%), hsl(${(hue + 30) % 360} 65% 55%))`;
  if (/^KODEX/.test(n)) color = '#1b64f2';
  else if (/^TIGER/.test(n)) color = '#f57c00';
  else if (/^SOL/.test(n)) color = '#1689e8';
  else if (/^RISE/.test(n)) color = '#f2b705';
  else if (/^삼성/.test(n)) color = '#1428a0';
  else if (/^JH /.test(n)) color = 'linear-gradient(135deg, #3182f6, #6a3df0)'; // JH증권 자체 ETF
  const lev = levOf(code) > 1 ? levOf(code) + 'x' : '';
  const inv = INVERSE.includes(code) || /인버스/.test(n);
  let text;
  if (inv) text = `<i>인버스</i>${lev || ''}`;
  else if (lev) text = lev;
  else if (/^KODEX 200/.test(n)) text = '<i>코스피</i>200';
  else if (/커버드콜/.test(n)) text = '₩';
  else if (/^(QQQ|QQQM|QQQI)$/.test(code)) text = '<i>나스닥</i>100';
  else if (code === 'VOO') text = '<i>S&amp;P</i>500';
  else text = (/^[A-Za-z]/.test(n) ? n.replace(/[^A-Za-z0-9]/g, '').slice(0, 2) : n.replace(/^(KODEX|TIGER|SOL|RISE)\s*/, '').slice(0, 1));
  return `<span class="lg-badge" style="background:${color}">${text}</span>`;
}
function logoSrcs(code) {
  if (info(code).logo) return [info(code).logo]; // 직접 넣은 로고 이미지
  if (info(code).fake || FAKE_LOGOS[code]) return []; // 가상 종목·전용 로고가 있는 종목은 바로 아이콘으로
  const s = info(code), srcs = [], lc = s.logoCode || code;
  // 해외는 네이버 로고(로이터 코드 기준)가 가장 정확해서 먼저 시도
  if (s.rc != null) srcs.push(`https://ssl.pstatic.net/imgstock/fn/real/logo/png/stock/Stock${s.rc.startsWith('=') ? s.rc.slice(1) : code + s.rc}.png`);
  srcs.push(`https://static.toss.im/png-icons/securities/icn-sec-fill-${lc}.png`);
  if (/^\d{6}$/.test(lc)) srcs.push(`https://ssl.pstatic.net/imgstock/fn/real/logo/png/stock/Stock${lc}.png`);
  else if (isUS(code) && !s.sub && s.rc == null) srcs.push(`https://financialmodelingprep.com/image-stock/${code.replace('.', '-')}.png`);
  return srcs;
}
// 목록이 몇 초마다 다시 그려지므로, 성공/실패한 주소를 기억해 깜빡임·재요청을 막음
const logoOk = {}, logoBad = new Set();
function nextLogo(img) {
  logoBad.add(img.getAttribute('src'));
  const rest = img.dataset.rest ? img.dataset.rest.split('|') : [];
  if (rest.length) { img.dataset.rest = rest.slice(1).join('|'); img.src = rest[0]; } else img.remove();
}
function logoLoaded(img) { logoOk[img.dataset.code] = img.getAttribute('src'); img.classList.add('ok'); }
function logoHTML(code) {
  const srcs = logoOk[code] ? [logoOk[code]] : logoSrcs(code).filter(u => !logoBad.has(u));
  const flag = isUS(code) ? '<span class="flag"></span>' : '';
  if (!srcs.length) return `<span class="lg">${badge(code)}${flag}</span>`;
  const [first, ...rest] = srcs;
  return `<span class="lg">${badge(code)}<img src="${first}"${logoOk[code] ? ' class="ok"' : ''} data-code="${code}" data-rest="${rest.join('|')}" alt=""
    onload="logoLoaded(this)" onerror="nextLogo(this)">${flag}</span>`;
}

function rowHTML(code, sub, right1, right2, right2cls, rank) {
  return `<li data-code="${code}" data-mk="${info(code).mk}"${rank ? ' class="ranked"' : ''}>
      ${rank ? `<span class="rank${rank <= 3 ? ' podium' : ''}">${rank}</span>` : ''}
      <span class="nm">${logoHTML(code)}<span class="tx">${info(code).name}<small class="muted">${sub}</small></span></span>
      <canvas></canvas>
      <span class="px"><b>${right1}</b><small class="${right2cls}">${right2}</small></span>
    </li>`;
}
const priceText = code => px(code, last(code)).replace('원', '');
const subOf = code => info(code).sub || code;
const priceRow = code => rowHTML(code, subOf(code), priceText(code), pct(change(code)), cls(change(code)));

// 둘러보기 순위: 정렬 기준과 오른쪽 아래에 보여줄 값
const SORTS = {
  amount: { key: c => state.volume[c].amount, show: c => bigNum(state.volume[c].amount, '원') },
  shares: { key: c => state.volume[c].shares, show: c => bigNum(state.volume[c].shares, '주') },
  up:     { key: c => change(c),  show: null },
  down:   { key: c => -change(c), show: null },
};
function rankRows() {
  const sort = SORTS[state.sort];
  return STOCKS
    .filter(s => state.tab === 'ALL' || s.mk === state.tab)
    .map(s => s.code)
    .sort((a, b) => sort.key(b) - sort.key(a))
    .slice(0, RANK_MAX)
    .map((c, i) => {
      const ch = change(c), chHTML = `<span class="${cls(ch)}">${pct(ch)}</span>`;
      return sort.show
        ? rowHTML(c, `${subOf(c)} · ${chHTML}`, priceText(c), sort.show(c), 'muted', i + 1)
        : rowHTML(c, subOf(c), priceText(c), pct(ch), cls(ch), i + 1);
    })
    .join('');
}

// 검색: 이름(한글·영어), 종목코드·티커, 초성(ㅅㅅㅈㅈ → 삼성전자)
const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const choOf = str => [...str].map(ch => {
  const k = ch.charCodeAt(0) - 0xac00;
  return k >= 0 && k < 11172 ? CHO[Math.floor(k / 588)] : ch;
}).join('');
const norm = str => (str || '').toLowerCase().replace(/\s+/g, '');
let query = '';
function searchRows() {
  const q = norm(query), onlyCho = /^[ㄱ-ㅎ]+$/.test(q);
  const score = s => {
    const name = norm(s.name), code = s.code.toLowerCase();
    if (code === q) return 0;
    if (name === q) return 0.5;
    if (onlyCho) { const c = (s._cho ||= norm(choOf(s.name))); return c.startsWith(q) ? 1 : c.includes(q) ? 3 : 9; }
    if (name.startsWith(q)) return 1;
    if (code.startsWith(q)) return 2;
    if (name.includes(q)) return 3;
    if (norm(s.eng).includes(q)) return 4;
    return 9;
  };
  const hits = STOCKS.filter(s => state.tab === 'ALL' || s.mk === state.tab)
    .map(s => [s, score(s)]).filter(([, sc]) => sc < 9)
    .sort((a, b) => a[1] - b[1] || state.volume[b[0].code].amount - state.volume[a[0].code].amount);
  $('q-info').textContent = hits.length ? `검색 결과 ${hits.length.toLocaleString('ko-KR')}개${hits.length > 50 ? ' · 위에서 50개만 보여요' : ''}` : '검색 결과가 없습니다.';
  return hits.slice(0, 50).map(([s]) => priceRow(s.code)).join('');
}

function select(code) {
  state.sel = code;
  state.recent = [code, ...state.recent.filter(c => c !== code)].slice(0, 20);
  save();
  if (isPhone()) openDetail();
  render();
}

// 휴대폰: 종목 상세를 전체 화면으로 열고, 폰의 뒤로가기로 닫음
const isPhone = () => matchMedia('(max-width: 760px)').matches;
function openDetail() {
  if (document.body.classList.contains('detail-open')) return;
  document.body.classList.add('detail-open');
  $('detail').scrollTop = 0;
  history.pushState({ detail: true }, '');
}
function closeDetail() { document.body.classList.remove('detail-open'); render(); }
window.addEventListener('popstate', () => {
  if (order) { closeOrder(); history.pushState({ detail: true }, ''); return; } // 주문 창부터 닫기
  if (document.body.classList.contains('detail-open')) closeDetail();
});

// 판매 수익: 날짜별로 묶고, 그날 국내·해외 합계 + 종목별 수익 (토스 판매수익 화면처럼)
function renderRealized() {
  const list = state.realized;
  const sign = n => (n > 0 ? '+' : n < 0 ? '-' : '');
  const amt = n => sign(n) + Math.round(Math.abs(n)).toLocaleString('ko-KR') + '원';
  const rate = (pnl, cost) => (cost ? Math.abs(pnl / cost * 100).toFixed(2).replace(/\.?0+$/, '') : '0') + '%';
  const total = list.reduce((a, r) => a + r.pnl, 0), totalCost = list.reduce((a, r) => a + r.cost, 0);
  $('r-total').innerHTML = list.length ? `총 판매 수익 <b class="${cls(total)}">${amt(total)} (${sign(total)}${rate(total, totalCost)})</b>` : '';
  if (!list.length) { $('realized').innerHTML = '<p class="muted">아직 판 주식이 없습니다. 주식을 팔면 여기에 수익이 쌓여요.</p>'; return; }
  // 날짜별 묶기 (최근 날짜부터)
  const days = new Map();
  for (const r of list) {
    const d = new Date(r.t), key = d.toDateString();
    if (!days.has(key)) days.set(key, { d, rows: [] });
    days.get(key).rows.push(r);
  }
  $('realized').innerHTML = [...days.values()].map(({ d, rows }) => {
    const title = `${d.getMonth() + 1}월 ${d.getDate()}일 (${'일월화수목금토'[d.getDay()]})`;
    const sums = ['KR', 'US'].map(mk => {
      const rs = rows.filter(r => r.mk === mk);
      if (!rs.length) return '';
      const p = rs.reduce((a, r) => a + r.pnl, 0), c = rs.reduce((a, r) => a + r.cost, 0);
      return `<p class="r-sum">${mk === 'KR' ? '국내주식' : '해외주식'} <span class="${cls(p)}">${amt(p)} (${rate(p, c)})</span></p>`;
    }).join('');
    // 같은 날 같은 종목은 합쳐서 한 줄
    const by = new Map();
    for (const r of rows) {
      const o = by.get(r.code) || { code: r.code, name: r.name, pnl: 0, cost: 0 };
      o.pnl += r.pnl; o.cost += r.cost; by.set(r.code, o);
    }
    const items = [...by.values()].map(o => `<li data-code="${o.code}">
        ${logoHTML(o.code)}<span class="r-name">${o.name}</span>
        <span class="r-val ${cls(o.pnl)}"><b>${amt(o.pnl)}</b><small>${rate(o.pnl, o.cost)}</small></span>
      </li>`).join('');
    return `<div class="r-day"><h3>${title}</h3>${sums}<ul class="r-list">${items}</ul></div>`;
  }).join('');
}

function fillList(el, html) {
  el.innerHTML = html;
  el.querySelectorAll('li').forEach(li => {
    li.classList.toggle('sel', li.dataset.code === state.sel);
    ensureHist(li.dataset.code);
    if (!li.hidden) draw(li.querySelector('canvas'), state.prices[li.dataset.code].hist, lineColor(li.dataset.code), false);
  });
}

function render() {
  // 페이지 전환
  document.querySelectorAll('.nav button').forEach(b => b.classList.toggle('on', b.dataset.page === state.page));
  for (const p of ['browse', 'recent', 'mine']) $('page-' + p).hidden = p !== state.page;

  // 주식 둘러보기
  if (state.page === 'browse') {
    document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === state.tab));
    document.querySelectorAll('.sorts button').forEach(b => b.classList.toggle('on', b.dataset.sort === state.sort));
    // 검색어가 있으면 검색 결과, 없으면 순위
    const searching = norm(query) !== '';
    document.querySelector('.sorts').hidden = searching;
    $('q-info').hidden = !searching;
    fillList($('browse-list'), searching ? searchRows() : rankRows());
  }

  // 최근 본
  if (state.page === 'recent') {
    fillList($('recent-list'), state.recent.map(priceRow).join(''));
    $('recent-empty').hidden = state.recent.length > 0;
  }

  // 자산 계산 (원화 기준)
  let value = 0, cost = 0;
  const holds = Object.entries(state.holdings).map(([code, h]) => {
    const cur = last(code), v = toKRW(code, cur) * h.qty, pl = toKRW(code, cur - h.avg) * h.qty;
    value += v;
    cost += toKRW(code, h.avg) * h.qty;
    return rowHTML(code, `${h.qty}주 · 평균 ${px(code, round(code, h.avg))}`, won(v),
      `${won(pl)} (${pct((cur / h.avg - 1) * 100)})`, cls(pl));
  });
  // 총 자산 = 주문 가능 현금 + 미체결 매수로 묶인 현금 + 주식 평가금액
  const total = state.cash + reservedCash() + value, pnl = value - cost, ret = (total / START_CASH - 1) * 100;
  $('total').className = cls(ret);
  // 휴대폰 상단 요약칸은 좁아서 억·만 단위로 짧게
  const head = isPhone() ? shortWon : won;
  $('total').textContent = head(total);
  $('cash').textContent = head(state.cash);
  // 투자금: 보유 주식의 현재 평가금액 (시세에 따라 실시간 변동) + 매입금액 대비 손익률
  $('invest').textContent = head(value);
  $('invest').className = cls(pnl);
  $('invest-pnl').textContent = cost ? `${pnl > 0 ? '+' : ''}${head(pnl)} (${pct((value / cost - 1) * 100)})` : '';
  $('invest-pnl').className = cls(pnl);

  // 내 주식
  if (state.page === 'mine') {
    $('m-total').textContent = `${won(total)}`;
    $('m-total').className = cls(ret);
    // 총 수익 = 총 자산 − 시작 자금 (판 주식 수익 + 보유 주식 손익 모두 포함)
    const profit = total - START_CASH;
    $('m-profit').textContent = `${profit > 0 ? '+' : ''}${won(profit)} (${pct(ret)})`;
    $('m-profit').className = cls(profit);
    $('m-cash').textContent = won(state.cash);
    $('m-pnl').textContent = `${won(pnl)}${cost ? ` (${pct((value / cost - 1) * 100)})` : ''}`;
    $('m-pnl').className = cls(pnl);
    fillList($('hold-list'), holds.join(''));
    $('hold-empty').hidden = holds.length > 0;
    $('m-orders').innerHTML = ordersHTML(state.orders);
    $('m-orders-empty').hidden = state.orders.length > 0;
    $('m-reserved').textContent = state.orders.length ? `미체결 매수로 묶인 현금 ${won(reservedCash())}` : '';
    $('hist').innerHTML = state.trades.length
      ? state.trades.map(t => `<li><span><b class="${t.side === 'buy' ? 'up' : 'down'}">${t.side === 'buy' ? '매수' : '매도'}</b> ${t.name} ${t.n}주</span>
          <span class="muted">${px(t.code, t.p)} · ${new Date(t.t).toLocaleTimeString('ko-KR')}</span></li>`).join('')
      : '<li class="muted">거래 내역이 없습니다.</li>';
    renderRealized();
  }

  // 선택 종목
  const c = state.sel, s = info(c), ch = change(c), p = last(c), diff = p - state.prices[c].open;
  $('d-name').textContent = s.name;
  if ($('d-logo').dataset.code !== c) { $('d-logo').innerHTML = logoHTML(c); $('d-logo').dataset.code = c; }
  $('d-code').textContent = `${subOf(c)} · ${s.market || (s.mk === 'US' ? '해외' : '국내')}`;
  // 해외 종목은 달러 옆에 원화 환산 가격을 작게
  $('d-price').innerHTML = px(c, p) + (isUS(c) ? `<small class="krw">${won(toKRW(c, p))}</small>` : '');
  $('d-price').className = 'big ' + cls(ch);
  $('d-change').textContent = `${pct(ch)} (${diff > 0 ? '+' : diff < 0 ? '-' : ''}${px(c, Math.abs(diff))})`;
  $('d-change').className = cls(ch);
  ensureHist(c);
  redrawChart();
  document.querySelectorAll('.chart-type button').forEach(b => b.classList.toggle('on', b.dataset.ct === (state.chart || 'line')));
  $('cost').textContent = `보유 ${heldQty(c)}주 · 최대 매수 ${maxBuy(c)}주`;
  // 이 종목의 미체결 주문
  const mine = state.orders.filter(o => o.code === c);
  $('d-orders').innerHTML = ordersHTML(mine);
  $('d-orders-wrap').hidden = !mine.length;
  renderBook();
  renderOrder();
}

// 이벤트
// 매도호가를 누르면 매수, 매수호가를 누르면 매도 주문 창
// 호가를 누르면 그 가격으로 매수 주문 창 (창 안에서 매도로 바꿀 수 있음)
$('book').addEventListener('click', e => { const r = e.target.closest('.br'); if (r) openOrder('buy', Number(r.dataset.px)); });
// 미체결 주문 취소
document.addEventListener('click', e => {
  const c = e.target.closest('[data-cancel]'); if (c) return cancelOrder(Number(c.dataset.cancel));
  const ed = e.target.closest('[data-edit]'); if (ed) editOrder(Number(ed.dataset.edit));
});
// 차트 짚어 보기: 마우스는 올리기만 해도, 손가락은 누르고 있는 동안
{
  const cv = $('chart'); let touching = false;
  const at = e => { hoverX = e.clientX - cv.getBoundingClientRect().left; redrawChart(); };
  const off = () => { touching = false; hoverX = null; redrawChart(); };
  cv.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { touching = true; at(e); } });
  cv.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' || touching) at(e); });
  cv.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') off(); });
  cv.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') off(); });
  cv.addEventListener('pointercancel', off);
}
// 차트 기간 (실시간 / 1분 / 10분 / 1시간 / 전체)
document.querySelectorAll('.ranges button').forEach(b =>
  b.addEventListener('click', () => { state.tf = b.dataset.tf; save(); redrawChart(); }));
// 차트 종류 (라인 / 캔들)
document.querySelectorAll('.chart-type button').forEach(b =>
  b.addEventListener('click', () => { state.chart = b.dataset.ct; save(); render(); }));
for (const id of ['browse-list', 'recent-list', 'hold-list', 'realized'])
  $(id).addEventListener('click', e => { const li = e.target.closest('li'); if (li) select(li.dataset.code); });
document.querySelectorAll('.nav button').forEach(b =>
  b.addEventListener('click', () => { state.page = b.dataset.page; save(); render(); }));
document.querySelectorAll('.tabs button').forEach(b =>
  b.addEventListener('click', () => { state.tab = b.dataset.tab; save(); render(); }));
document.querySelectorAll('.sorts button').forEach(b =>
  b.addEventListener('click', () => { state.sort = b.dataset.sort; save(); render(); }));
$('q').addEventListener('input', e => { query = e.target.value; render(); });
$('q').addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); }); // 폰에서 검색 누르면 키보드 닫기
$('buy').addEventListener('click', () => openOrder('buy'));
$('sell').addEventListener('click', () => openOrder('sell'));
$('mo-qty').addEventListener('input', () => { $('mo-err').textContent = ''; renderOrder(); });
$('mo-qty').addEventListener('keydown', e => { if (e.key === 'Enter') submitOrder(); });
document.querySelectorAll('#modal .quick [data-q]').forEach(b => b.addEventListener('click', () => {
  $('mo-qty').value = Math.max(1, moQty() + Number(b.dataset.q));
  renderOrder();
}));
$('mo-max').addEventListener('click', () => {
  $('mo-qty').value = order.side === 'buy' ? moMaxBuy(moPrice() || last(order.code)) : Math.max(0, moSellable());
  $('mo-err').textContent = '';
  renderOrder();
});
// 가격: 직접 입력, 호가 단위로 −/+, 현재가로
$('mo-px').addEventListener('input', () => { $('mo-err').textContent = ''; renderOrder(); });
$('mo-px').addEventListener('change', () => { const p = moPrice(); if (p) $('mo-px').value = p; renderOrder(); });
$('mo-px').addEventListener('keydown', e => { if (e.key === 'Enter') submitOrder(); });
const nudge = dir => {
  const p = moPrice() || last(order.code), t = tickSize(order.code, dir < 0 ? p - 1e-9 : p);
  $('mo-px').value = Math.max(t, snap(order.code, round(order.code, p) + dir * t));
  renderOrder();
};
$('mo-px-down').addEventListener('click', () => nudge(-1));
$('mo-px-up').addEventListener('click', () => nudge(1));
$('mo-px-cur').addEventListener('click', () => { $('mo-px').value = last(order.code); renderOrder(); });
document.querySelectorAll('.mo-side button').forEach(b => b.addEventListener('click', () => setSide(b.dataset.side)));
$('mo-ok').addEventListener('click', submitOrder);
$('mo-cancel').addEventListener('click', closeOrder);
$('modal').addEventListener('click', e => { if (e.target === $('modal')) closeOrder(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && order) closeOrder(); });
$('reset').addEventListener('click', () => {
  if (!confirm('자산과 거래 내역을 모두 초기화할까요?')) return;
  state = fresh();
  save();
  render();
  msg('초기화되었습니다.');
});
window.addEventListener('resize', render);
$('d-back').addEventListener('click', () => history.back());

// 다크 / 라이트 모드: 직접 고른 값이 없으면 기기 설정을 따름
const darkMQ = matchMedia('(prefers-color-scheme: dark)');
const isDark = () => (document.documentElement.dataset.theme || (darkMQ.matches ? 'dark' : 'light')) === 'dark';
function applyTheme() {
  document.documentElement.classList.toggle('is-dark', isDark());
  document.querySelectorAll('meta[name=theme-color]').forEach(m => m.setAttribute('content', isDark() ? '#1b1d21' : '#ffffff'));
  render(); // 차트 색을 새 테마로 다시 그림
}
$('theme').addEventListener('click', () => {
  const next = isDark() ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('jh-theme', next); } catch {}
  applyTheme();
});
darkMQ.addEventListener?.('change', applyTheme);
document.documentElement.classList.toggle('is-dark', isDark());

// 앱 설치(PWA)용 서비스 워커: https 또는 localhost 에서만 동작
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost'))
  navigator.serviceWorker.register('sw.js').catch(() => {});

render();
setTimeout(tick, 3000 + Math.random() * 2000);
