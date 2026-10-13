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
];
// 원화로 받은 해외 가격은 달러로 환산
for (const s of STOCKS) if (s.won) s.price = Math.round(s.won / FX * 100) / 100;
const START_CASH = 100_000_000;
const HIST_LEN = 120;
const RANK_MAX = 100;
const KEY = 'mock-stock-v2';

const info = code => STOCKS.find(s => s.code === code);
const isUS = code => info(code).mk === 'US';
// 국내는 호가 단위로, 해외는 센트 단위로 맞춤 (tickSize는 아래 호가 부분)
const round = (code, v) => (isUS(code) ? Math.round(v * 100) / 100 : Math.max(1, Math.round(v / tickSize(code, v)) * tickSize(code, v)));
const toKRW = (code, v) => (isUS(code) ? v * FX : v);
const won = n => Math.round(n).toLocaleString('ko-KR') + '원';
const px = (code, v) => (isUS(code)
  ? '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
    tab: 'ALL', sort: 'amount', page: 'browse', recent: [] };
}

let state;
try { state = JSON.parse(localStorage.getItem(KEY)); } catch { state = null; }
if (!state || !state.prices) state = fresh();
state.page ||= 'browse';
state.sort ||= 'amount';
state.recent ||= [];
state.volume ||= {};
// 기본금이 바뀌면 차액만큼 현금을 맞춰 줌 (보유 주식·거래 내역은 유지)
if (state.startCash !== START_CASH) {
  state.cash += START_CASH - (state.startCash || 10_000_000);
  state.startCash = START_CASH;
}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };

const last = code => { const h = state.prices[code].hist; return h[h.length - 1]; };
const change = code => (last(code) / state.prices[code].open - 1) * 100;

// 거래량/거래대금 (모의). 가격이 크게 움직일수록 거래가 늘어남
function addVolume(code, r) {
  const v = state.volume[code];
  const amt = v.base * (0.4 + Math.random() * 1.2) * (1 + Math.abs(r) * 60);
  v.shares += Math.max(1, Math.round(amt / toKRW(code, last(code))));
  v.amount += amt;
}
const DATA_VER = 7; // 시작 데이터가 바뀌면 올림 → 시세/거래량만 새로 시작 (자산은 유지)
if (state.dataVer !== DATA_VER) { state.prices = {}; state.volume = {}; state.dataVer = DATA_VER; }
// 종목별 초기값 (새 종목이 추가돼도 기존 저장 데이터는 유지)
// 처음부터 등락이 보이도록 장 시작 후 흐름을 미리 만들어 둠
function initStock(s) {
  if (!state.prices[s.code]) {
    const N = 80, min = isUS(s.code) ? 0.01 : 1;
    let open, end;
    if (s.rate != null) {
      // 실제 등락률: 전일 종가에서 출발해 현재가에서 끝나는 흐름
      open = s.price / (1 + s.rate / 100);
      end = s.price;
    } else {
      // 종목마다 오늘의 방향(추세)을 다르게
      open = s.price;
      end = s.price * (1 + (Math.random() - 0.5) * s.vol * 0.25 * N);
    }
    const walk = [0];
    for (let i = 1; i < N; i++) walk.push(walk[i - 1] + (Math.random() - 0.5) * 2 * s.vol);
    const hist = walk.map((w, i) => {
      const t = i / (N - 1);
      const base = open * Math.pow(end / open, t);
      return Math.max(min, round(s.code, base * (1 + w - t * walk[N - 1])));
    });
    // 실제 현재가는 반올림 없이 그대로 (토스 가격이 호가 단위표보다 잘게 나뉜 경우가 있음)
    hist[N - 1] = s.rate != null ? s.price : round(s.code, end);
    state.prices[s.code] = { open, hist };
  }
  if (!state.volume[s.code]) {
    // 실제 거래대금(억원)으로 시작. 순위 밖 종목은 국내 100위(2.1억), 해외 100위(0.26억)보다 적게
    const amount = (s.amt != null ? s.amt : s.mk === 'US' ? 0.05 + Math.random() * 0.2 : 0.3 + Math.random() * 1.7) * 1e8;
    state.volume[s.code] = {
      base: amount / 1500,
      amount,
      shares: Math.round(amount / toKRW(s.code, s.price)),
    };
  }
}
STOCKS.forEach(initStock);

// 가격 변동: 랜덤 워크 + 가끔 뉴스 이벤트
const NEWS_UP = ['신제품 발표 호평', '대규모 수주 소식', '실적 예상치 상회', '목표주가 상향'];
const NEWS_DOWN = ['실적 부진 우려', '목표주가 하향', '경쟁 심화 우려', '규제 리스크 부각'];
function step(s) {
  // 2배 ETF는 1.25배, 3배 ETF는 1.5배 더 크게 움직임
  const boost = { 1: 1, 2: 1.25, 3: 1.5 }[levOf(s.code)];
  let r = (Math.random() - 0.5) * 2 * s.vol * boost;
  if (Math.random() < 0.0015) {
    const good = Math.random() < 0.5;
    r += (good ? 1 : -1) * (0.02 + Math.random() * 0.03);
    const pool = good ? NEWS_UP : NEWS_DOWN;
    toast(`[${s.name}] ${pool[Math.floor(Math.random() * pool.length)]}`);
  }
  const h = state.prices[s.code].hist;
  h.push(Math.max(isUS(s.code) ? 0.01 : 1, round(s.code, last(s.code) * (1 + r))));
  if (h.length > HIST_LEN) h.shift();
  addVolume(s.code, r);
}
// 호가 (모의). 호가 단위는 한국거래소 규칙, 해외는 $0.01
const BOOK_LV = 7;
function tickSize(code, p) {
  if (isUS(code)) return 0.01;
  const s = info(code);
  if (s.sub === 'ETF' || s.sub === 'ETN' || /^(KODEX|TIGER|SOL|RISE)/.test(s.name)) return p < 2000 ? 1 : 5;
  return p < 2000 ? 1 : p < 5000 ? 5 : p < 20000 ? 10 : p < 50000 ? 50 : p < 200000 ? 100 : p < 500000 ? 500 : 1000;
}
const snap = (code, v) => (isUS(code) ? Math.round(v * 100) / 100 : v);
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
    return `<div class="br ${side}${r.px === ask1 ? ' cur' : ''}" data-side="${side === 'ask' ? 'buy' : 'sell'}">
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
  shakeBook(state.sel);
  save();
  render();
  setTimeout(tick, 3000 + Math.random() * 2000); // 3~5초 간격
}

// 주문
const heldQty = code => (state.holdings[code] ? state.holdings[code].qty : 0);
const maxBuy = code => Math.floor(state.cash / toKRW(code, last(code)));

// 체결. 실패하면 오류 문구를 돌려줌
function trade(side, code, n) {
  const p = last(code), name = info(code).name;
  const krw = toKRW(code, p) * n;
  const h = state.holdings[code] || { qty: 0, avg: 0 };
  if (!(n >= 1)) return '수량을 1 이상 입력하세요.';
  if (side === 'buy') {
    if (krw > state.cash) return `현금이 부족합니다. (최대 ${maxBuy(code)}주)`;
    h.avg = (h.avg * h.qty + p * n) / (h.qty + n);
    h.qty += n;
    state.cash -= krw;
  } else {
    if (n > h.qty) return `보유 수량(${h.qty}주)보다 많이 팔 수 없습니다.`;
    h.qty -= n;
    state.cash += krw;
  }
  if (h.qty > 0) state.holdings[code] = h; else delete state.holdings[code];
  state.trades.unshift({ t: Date.now(), side, code, name, n, p });
  state.trades = state.trades.slice(0, 100);
  msg(`${name} ${n}주 ${side === 'buy' ? '매수' : '매도'} 체결 (${px(code, p)})`);
  save();
  render();
  return null;
}

// 주문 창
let order = null; // { side, code }
const moQty = () => Math.floor(Number($('mo-qty').value) || 0);
function openOrder(side) {
  const code = state.sel;
  if (side === 'sell' && heldQty(code) === 0) return msg('보유한 주식이 없습니다.', true);
  order = { side, code };
  const buy = side === 'buy';
  $('modal').className = 'modal ' + (buy ? 'is-buy' : 'is-sell');
  $('mo-title').textContent = `${info(code).name} ${buy ? '매수' : '매도'}`;
  $('mo-max').textContent = buy ? '최대 매수' : '전부 매도';
  $('mo-ok').textContent = buy ? '매수하기' : '매도하기';
  $('mo-qty').value = 1;
  $('mo-err').textContent = '';
  $('modal').hidden = false;
  $('mo-qty').focus();
  $('mo-qty').select();
  renderOrder();
}
function closeOrder() { order = null; $('modal').hidden = true; }
function renderOrder() {
  if (!order) return;
  const { side, code } = order, p = last(code), n = moQty(), krw = toKRW(code, p) * n;
  $('mo-price').textContent = `현재가 ${px(code, p)}${isUS(code) ? ` · 환율 ${FX.toLocaleString('ko-KR')}원` : ''}`;
  $('mo-avail').textContent = side === 'buy'
    ? `주문 가능 ${maxBuy(code)}주 (현금 ${won(state.cash)})`
    : `보유 ${heldQty(code)}주`;
  $('mo-total').textContent = won(krw);
  $('mo-after').textContent = side === 'buy'
    ? `주문 후 현금 ${won(state.cash - krw)}`
    : `주문 후 보유 ${heldQty(code) - n}주 · 현금 ${won(state.cash + krw)}`;
}
function submitOrder() {
  const err = trade(order.side, order.code, moQty());
  if (err) $('mo-err').textContent = err; else closeOrder();
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
const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const lineColor = code => (change(code) >= 0 ? css('--up') : css('--down'));

// 화면 그리기
// 종목 로고: 토스증권 → 네이버 → (해외) FMP 순으로 시도, 모두 실패하면 토스 스타일 아이콘
const THREE_X = ['KORU', 'SOXL', 'SOXS', 'TQQQ', 'SQQQ', 'TMF', 'GDXU', 'GDXD'];
const TWO_X = ['RAM', 'MUU', 'QLD', 'ETHU', 'ETHD', 'XXRP', 'DRAM', 'SNXX', 'BITX', 'SNDU', 'TSLL', 'BITU', 'IONX'];
// 레버리지 배수 (일반 종목은 1)
function levOf(code) {
  if (THREE_X.includes(code)) return 3;
  if (TWO_X.includes(code) || /2X|2x|레버리지/.test(info(code).name)) return 2;
  return 1;
}
const INVERSE = ['SOXS', 'SQQQ', 'ETHD', 'GDXD'];
function badge(code) {
  const s = info(code), n = s.name;
  let color = `hsl(${[...code].reduce((a, ch) => a + ch.charCodeAt(0) * 7, 0) % 360} 55% 45%)`;
  if (/^KODEX/.test(n)) color = '#1b64f2';
  else if (/^TIGER/.test(n)) color = '#f57c00';
  else if (/^SOL/.test(n)) color = '#1689e8';
  else if (/^RISE/.test(n)) color = '#f2b705';
  else if (/^삼성/.test(n)) color = '#1428a0';
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
  const srcs = [`https://static.toss.im/png-icons/securities/icn-sec-fill-${code}.png`];
  if (/^\d{6}$/.test(code)) srcs.push(`https://ssl.pstatic.net/imgstock/fn/real/logo/png/stock/Stock${code}.png`);
  else if (isUS(code) && !info(code).sub) srcs.push(`https://financialmodelingprep.com/image-stock/${code.replace('.', '-')}.png`);
  return srcs;
}
// 목록이 몇 초마다 다시 그려지므로, 성공/실패한 주소를 기억해 깜빡임·재요청을 막음
const logoOk = {}, logoBad = new Set();
function nextLogo(img) {
  logoBad.add(img.getAttribute('src'));
  const rest = img.dataset.rest ? img.dataset.rest.split('|') : [];
  if (rest.length) { img.dataset.rest = rest.slice(1).join('|'); img.src = rest[0]; } else img.remove();
}
function logoLoaded(img) { logoOk[img.dataset.code] = img.getAttribute('src'); }
function logoHTML(code) {
  const srcs = logoOk[code] ? [logoOk[code]] : logoSrcs(code).filter(u => !logoBad.has(u));
  const flag = isUS(code) ? '<span class="flag"></span>' : '';
  if (!srcs.length) return `<span class="lg">${badge(code)}${flag}</span>`;
  const [first, ...rest] = srcs;
  return `<span class="lg">${badge(code)}<img src="${first}" data-code="${code}" data-rest="${rest.join('|')}" alt=""
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

function select(code) {
  state.sel = code;
  state.recent = [code, ...state.recent.filter(c => c !== code)].slice(0, 20);
  save();
  render();
}

function fillList(el, html) {
  el.innerHTML = html;
  el.querySelectorAll('li').forEach(li => {
    li.classList.toggle('sel', li.dataset.code === state.sel);
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
    fillList($('browse-list'), rankRows());
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
  const total = state.cash + value, pnl = value - cost, ret = (total / START_CASH - 1) * 100;
  $('total').textContent = won(total);
  $('total').className = cls(ret);
  $('cash').textContent = won(state.cash);

  // 내 주식
  if (state.page === 'mine') {
    $('m-total').textContent = `${won(total)}`;
    $('m-total').className = cls(ret);
    $('m-value').textContent = won(value);
    $('m-cash').textContent = won(state.cash);
    $('m-pnl').textContent = `${won(pnl)} (${pct(ret)})`;
    $('m-pnl').className = cls(pnl);
    fillList($('hold-list'), holds.join(''));
    $('hold-empty').hidden = holds.length > 0;
    $('hist').innerHTML = state.trades.length
      ? state.trades.map(t => `<li><span><b class="${t.side === 'buy' ? 'up' : 'down'}">${t.side === 'buy' ? '매수' : '매도'}</b> ${t.name} ${t.n}주</span>
          <span class="muted">${px(t.code, t.p)} · ${new Date(t.t).toLocaleTimeString('ko-KR')}</span></li>`).join('')
      : '<li class="muted">거래 내역이 없습니다.</li>';
  }

  // 선택 종목
  const c = state.sel, s = info(c), ch = change(c), p = last(c), diff = p - state.prices[c].open;
  $('d-name').textContent = s.name;
  if ($('d-logo').dataset.code !== c) { $('d-logo').innerHTML = logoHTML(c); $('d-logo').dataset.code = c; }
  $('d-code').textContent = `${subOf(c)} ·${s.mk === 'US' ? '해외' : '국내'}`;
  $('d-price').textContent = px(c, p);
  $('d-price').className = 'big ' + cls(ch);
  $('d-change').textContent = `${pct(ch)} (${diff > 0 ? '+' : diff < 0 ? '-' : ''}${px(c, Math.abs(diff))})`;
  $('d-change').className = cls(ch);
  draw($('chart'), state.prices[c].hist, lineColor(c), true);
  $('cost').textContent = `보유 ${heldQty(c)}주 · 최대 매수 ${maxBuy(c)}주`;
  renderBook();
  renderOrder();
}

// 이벤트
// 매도호가를 누르면 매수, 매수호가를 누르면 매도 주문 창
$('book').addEventListener('click', e => { const r = e.target.closest('.br'); if (r) openOrder(r.dataset.side); });
for (const id of ['browse-list', 'recent-list', 'hold-list'])
  $(id).addEventListener('click', e => { const li = e.target.closest('li'); if (li) select(li.dataset.code); });
document.querySelectorAll('.nav button').forEach(b =>
  b.addEventListener('click', () => { state.page = b.dataset.page; save(); render(); }));
document.querySelectorAll('.tabs button').forEach(b =>
  b.addEventListener('click', () => { state.tab = b.dataset.tab; save(); render(); }));
document.querySelectorAll('.sorts button').forEach(b =>
  b.addEventListener('click', () => { state.sort = b.dataset.sort; save(); render(); }));
$('buy').addEventListener('click', () => openOrder('buy'));
$('sell').addEventListener('click', () => openOrder('sell'));
$('mo-qty').addEventListener('input', () => { $('mo-err').textContent = ''; renderOrder(); });
$('mo-qty').addEventListener('keydown', e => { if (e.key === 'Enter') submitOrder(); });
document.querySelectorAll('#modal .quick [data-q]').forEach(b => b.addEventListener('click', () => {
  $('mo-qty').value = Math.max(1, moQty() + Number(b.dataset.q));
  renderOrder();
}));
$('mo-max').addEventListener('click', () => {
  $('mo-qty').value = order.side === 'buy' ? maxBuy(order.code) : heldQty(order.code);
  $('mo-err').textContent = '';
  renderOrder();
});
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

render();
setTimeout(tick, 3000 + Math.random() * 2000);
