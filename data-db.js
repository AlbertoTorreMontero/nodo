/* Bases de datos de práctica: F1 (modelo de los ejercicios de la FIA) y Películas (transacciones/índices).
   Datos reducidos y generados de forma determinista; ganadores reales donde se indica. */
(function () {
  const drivers = [
    [1,'Fernando','Alonso','Spanish','1981-07-29'],[2,'Carlos','Sainz','Spanish','1994-09-01'],
    [3,'Lewis','Hamilton','British','1985-01-07'],[4,'Sebastian','Vettel','German','1987-07-03'],
    [5,'Kimi','Räikkönen','Finnish','1979-10-17'],[6,'Valtteri','Bottas','Finnish','1989-08-28'],
    [7,'Max','Verstappen','Dutch','1997-09-30'],[8,'Daniel','Ricciardo','Australian','1989-07-01'],
    [9,'Sergio','Pérez','Mexican','1990-01-26'],[10,'Daniil','Kvyat','Russian','1994-04-26'],
    [11,'Robert','Kubica','Polish','1984-12-07'],[12,'Antonio','Giovinazzi','Italian','1993-12-14'],
    [13,'Michael','Schumacher','German','1969-01-03'],[14,'Pedro','de la Rosa','Spanish','1971-02-24'],
    [15,'Jenson','Button','British','1980-01-19'],[16,'Nico','Rosberg','German','1985-06-27'],
    [17,'Mark','Webber','Australian','1976-08-27'],[18,'Jarno','Trulli','Italian','1974-07-13']
  ];
  const constructors = [
    [1,'Ferrari','Italian'],[2,'Mercedes','German'],[3,'Red Bull','Austrian'],[4,'McLaren','British'],
    [5,'Toro Rosso','Italian'],[6,'Renault','French'],[7,'Force India','Indian'],[8,'Williams','British'],
    [9,'Sauber','Swiss'],[10,'Brawn','British'],[11,'Minardi','Italian'],[12,'Toyota','Japanese']
  ];
  const circuits = [
    [1,'Albert Park','Melbourne','Australia'],[2,'Shanghai International Circuit','Shanghai','China'],
    [3,'Bahrain International Circuit','Sakhir','Bahrain'],[4,'Circuit de Barcelona-Catalunya','Montmeló','Spain'],
    [5,'Circuit de Monaco','Monte-Carlo','Monaco'],[6,'Hockenheimring','Hockenheim','Germany'],
    [7,'Nürburgring','Nürburg','Germany'],[8,'Suzuka Circuit','Suzuka','Japan'],
    [9,'Yas Marina Circuit','Abu Dhabi','UAE'],[10,'Sochi Autodrom','Sochi','Russia'],[11,'Silverstone','Silverstone','UK']
  ];
  const races = [
    [1,2009,15,8,'Japanese Grand Prix','2009-10-04'],
    [2,2010,1,3,'Bahrain Grand Prix','2010-03-14'],[3,2010,2,1,'Australian Grand Prix','2010-03-28'],
    [4,2010,11,6,'German Grand Prix','2010-07-25'],
    [5,2016,1,1,'Australian Grand Prix','2016-03-20'],[6,2016,5,4,'Spanish Grand Prix','2016-05-15'],
    [7,2016,6,5,'Monaco Grand Prix','2016-05-29'],
    [8,2017,1,1,'Australian Grand Prix','2017-03-26'],[9,2017,2,2,'Chinese Grand Prix','2017-04-09'],
    [10,2017,4,10,'Russian Grand Prix','2017-04-30'],[11,2017,5,4,'Spanish Grand Prix','2017-05-14'],
    [12,2017,20,9,'Abu Dhabi Grand Prix','2017-11-26']
  ];
  const status = [[1,'Finished'],[2,'Disqualified'],[3,'Accident'],[4,'Collision'],[5,'Engine'],[6,'Gearbox'],[7,'Transmission'],[11,'+1 Lap']];
  // Orden de llegada por carrera: [driverId, constructorId, statusId]
  const R = {
    1:[[4,3,1],[17,3,1],[15,10,1],[3,4,1],[18,12,1],[5,1,1],[16,8,1],[1,6,1],[11,9,11],[14,9,3]],
    2:[[1,1,1],[3,4,1],[15,4,1],[16,2,1],[13,2,1],[17,3,1],[11,6,1],[4,3,11],[14,9,6]],
    3:[[15,4,1],[11,6,1],[1,1,1],[3,4,1],[16,2,1],[17,3,1],[13,2,11],[14,9,5],[4,3,3]],
    4:[[1,1,1],[4,3,1],[17,3,1],[3,4,1],[15,4,1],[16,2,1],[13,2,1],[11,6,11],[14,9,7]],
    5:[[16,2,1],[3,2,1],[4,1,1],[8,3,1],[6,8,1],[7,5,1],[2,5,1],[9,7,11],[1,4,3],[10,3,5],[5,1,5]],
    6:[[7,3,1],[5,1,1],[4,1,1],[6,8,1],[2,5,1],[9,7,1],[8,3,1],[15,4,11],[10,5,1],[3,2,4],[16,2,4],[1,4,5]],
    7:[[3,2,1],[8,3,1],[9,7,1],[4,1,1],[1,4,1],[16,2,1],[2,5,1],[15,4,1],[6,8,11],[7,3,3],[10,5,4],[5,1,4]],
    8:[[4,1,1],[3,2,1],[6,2,1],[5,1,1],[7,3,1],[9,7,1],[2,5,1],[10,5,1],[12,9,1],[1,4,7],[8,3,5]],
    9:[[3,2,1],[4,1,1],[7,3,1],[8,3,1],[5,1,1],[6,2,1],[2,5,1],[9,7,1],[10,5,1],[1,4,7],[12,9,3]],
    10:[[6,2,1],[4,1,1],[5,1,1],[3,2,1],[7,3,1],[9,7,1],[2,5,1],[10,5,1],[1,4,5],[8,3,6]],
    11:[[3,2,1],[4,1,1],[8,3,1],[9,7,1],[2,5,1],[10,5,1],[1,4,1],[6,2,5],[7,3,3],[5,1,4]],
    12:[[6,2,1],[3,2,1],[4,1,1],[5,1,1],[8,3,1],[7,3,1],[9,7,1],[1,4,1],[2,5,1],[10,5,11]]
  };
  const pts = (year, pos) => year >= 2010 ? ([25,18,15,12,10,8,6,4,2,1][pos-1] || 0) : ([10,8,6,5,4,3,2,1][pos-1] || 0);
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const raceById = Object.fromEntries(races.map(r => [r[0], r]));
  const lapsBy = {1:53,2:49,3:58,4:67,5:57,6:66,7:78,8:57,9:56,10:52,11:66,12:55};
  const results = [], qualifying = [], pitstops = [];
  let rid = 1, qid = 1;
  for (const raceId of Object.keys(R).map(Number)) {
    const year = raceById[raceId][1];
    R[raceId].forEach(([d, c, s], i) => {
      const pos = i + 1, laps = s === 1 ? lapsBy[raceId] : s === 11 ? lapsBy[raceId] - 1 : Math.floor(lapsBy[raceId] * (0.2 + rnd() * 0.6));
      const speed = +(200 + rnd() * 25 - i * 0.6).toFixed(3);
      results.push([rid++, raceId, d, c, pos, s === 1 || s === 11 ? pts(year, pos) : 0, laps, s, speed]);
    });
    if (year >= 2016) {
      const order = R[raceId].map(x => x.slice(0, 2)).sort(() => rnd() - 0.45);
      order.forEach(([d, c], i) => {
        const p = i + 1, base = 80 + rnd() * 3;
        const t = v => `1:${(v).toFixed(3).padStart(6, '0')}`;
        qualifying.push([qid++, raceId, d, c, p, t(base - 60 + 20), p <= 15 ? t(base - 61 + 20) : '', p <= 10 ? t(base - 62 + 20) : '']);
      });
      if (raceId !== 7) R[raceId].forEach(([d], i) => {
        const n = 1 + Math.floor(rnd() * 3);
        for (let k = 1; k <= n; k++) pitstops.push([raceId, d, k, Math.floor(lapsBy[raceId] * k / (n + 1)), Math.floor(21000 + rnd() * 9000)]);
      });
    }
  }
  const q = v => v === null ? 'NULL' : typeof v === 'number' ? v : "'" + String(v).replace(/'/g, "''") + "'";
  const ins = (t, rows) => rows.map(r => `INSERT INTO ${t} VALUES (${r.map(q).join(',')});`).join('\n');
  window.F1_SQL = `
CREATE TABLE drivers (driverId INTEGER PRIMARY KEY, forename VARCHAR(250), surname VARCHAR(250), nationality VARCHAR(250), dob DATE);
CREATE TABLE constructors (constructorId INTEGER PRIMARY KEY, name VARCHAR(250), nationality VARCHAR(250));
CREATE TABLE circuits (circuitId INTEGER PRIMARY KEY, name VARCHAR(250), location VARCHAR(250), country VARCHAR(250));
CREATE TABLE races (raceId INTEGER PRIMARY KEY, year INTEGER, round INTEGER, circuitId INTEGER REFERENCES circuits(circuitId), name VARCHAR(250), date DATE);
CREATE TABLE status (statusId INTEGER PRIMARY KEY, status VARCHAR(250));
CREATE TABLE results (resultId INTEGER PRIMARY KEY, raceId INTEGER REFERENCES races(raceId), driverId INTEGER REFERENCES drivers(driverId), constructorId INTEGER REFERENCES constructors(constructorId), positionOrder INTEGER, points FLOAT, laps INTEGER, statusId INTEGER REFERENCES status(statusId), fastestLapSpeed DOUBLE);
CREATE TABLE qualifying (qualifyId INTEGER PRIMARY KEY, raceId INTEGER, driverId INTEGER, constructorId INTEGER, position INTEGER, q1 VARCHAR(20), q2 VARCHAR(20), q3 VARCHAR(20));
CREATE TABLE pitstops (raceId INTEGER, driverId INTEGER, stop INTEGER, lap INTEGER, milliseconds INTEGER, PRIMARY KEY (raceId, driverId, stop));
${ins('drivers', drivers)}
${ins('constructors', constructors)}
${ins('circuits', circuits)}
${ins('races', races)}
${ins('status', status)}
${ins('results', results)}
${ins('qualifying', qualifying)}
${ins('pitstops', pitstops)}`;
  window.F1_SCHEMA = {
    drivers: 'driverId, forename, surname, nationality, dob',
    constructors: 'constructorId, name, nationality',
    circuits: 'circuitId, name, location, country',
    races: 'raceId, year, round, circuitId, name, date',
    results: 'resultId, raceId, driverId, constructorId, positionOrder, points, laps, statusId, fastestLapSpeed',
    qualifying: 'qualifyId, raceId, driverId, constructorId, position, q1, q2, q3',
    pitstops: 'raceId, driverId, stop, lap, milliseconds',
    status: 'statusId, status'
  };

  // Películas (transacciones e índices)
  const first = ['Lonzo','Ana','Bruno','Carla','Diego','Elena','Fabio','Greta','Hugo','Irene','Julio','Karen','Luis','Marta','Nora','Óscar','Paula','Raúl','Sara','Tomás'];
  const last = ['Bode','Ruiz','Vega','Sanz','Mora','Gil','León','Pardo','Rey','Soto','Cano','Lara','Nieto','Ortiz','Prieto','Rivas'];
  const actors = []; let aid = 1;
  for (let i = 0; i < 400; i++) actors.push([aid++, first[(i * 7) % first.length], last[(i * 5 + 3) % last.length]]);
  actors.push([aid++, 'Lonzo', 'Bode']);
  const films = []; const titles = ['Niebla','Ruta','Ecos','Marea','Faro','Atlas','Brasa','Cumbre','Delta','Órbita','Prisma','Quimera','Raíz','Sombra','Trueno','Umbral','Vértigo','Zénit'];
  for (let i = 1; i <= 300; i++) films.push([i, titles[i % titles.length] + ' ' + Math.ceil(i / titles.length), 1960 + (i * 13) % 64, 80 + (i * 17) % 90]);
  const fa = []; seed = 11; const used = new Set();
  for (let i = 0; i < 1500; i++) { const f = 1 + Math.floor(rnd() * 300), a = 1 + Math.floor(rnd() * 400), k = f + '-' + a; if (!used.has(k)) { used.add(k); fa.push([a, f]); } }
  for (let f = 1; f <= 20; f++) fa.push([aid - 1, f * 3]);
  window.FILMS_SQL = `
CREATE TABLE film (film_id INTEGER PRIMARY KEY, title VARCHAR(255), release_year INTEGER, length_minutes INTEGER);
CREATE TABLE actor (actor_id INTEGER PRIMARY KEY, first_name VARCHAR(45), last_name VARCHAR(45));
CREATE TABLE film_actor (actor_id INTEGER, film_id INTEGER, PRIMARY KEY (actor_id, film_id));
${ins('film', films)}
${ins('actor', actors)}
${ins('film_actor', fa)}`;
  window.FILMS_SCHEMA = { film: 'film_id, title, release_year, length_minutes', actor: 'actor_id, first_name, last_name', film_actor: 'actor_id, film_id' };
})();
