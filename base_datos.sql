CREATE TABLE comunas (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre TEXT NOT NULL,
    region_id BIGINT REFERENCES regiones(id) ON DELETE CASCADE
);

TRUNCATE TABLE regiones RESTART IDENTITY CASCADE;

SELECT * FROM regiones;

DROP TABLE regiones;

CREATE TABLE regiones(
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre TEXT NOT NULL
);


INSERT INTO regiones (nombre) VALUES 
('Región de Arica y Parinacota'),
('Región de Tarapacá'),          
('Región de Antofagasta'),       
('Región de Atacama'),           
('Región de Coquimbo'),          
('Región de Valparaíso'),        
('Región Metropolitana de Santiago'),
('Región del Libertador General Bernardo O''Higgins'),
('Región del Maule'),            
('Región del Biobío'),           
('Región de la Araucanía'),      
('Región de Los Ríos'),          
('Región de Los Lagos'),         
('Región de Aysén del General Carlos Ibáñez del Campo'),
('Región de Magallanes y la Antártica Chilena'),
('Región de Ñuble');             



CREATE TABLE partidos (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre TEXT NOT NULL, 
    sigla TEXT NOT NULL, 
    url_img TEXT,
    descripcion TEXT
)



--TABLA LEGISLADORES BASE
CREATE TABLE legisladores (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre TEXT NOT NULL,
    partido_id BIGINT REFERENCES partidos(id) ON DELETE SET NULL,
    url_img TEXT,
    fecha_nacimiento DATE,
    profesion TEXT,
    trayectoria TEXT,
    periodo_inicio INTEGER,
    periodo_fin INTEGER
)

ALTER TABLE legisladores
ADD COLUMN estado TEXT;



CREATE TABLE compromisos (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    descripcion TEXT NOT NULL,
    cumplimiento BOOLEAN DEFAULT FALSE,
    legislador_id BIGINT REFERENCES legisladores(id) ON DELETE SET NULL,
)

CREATE TABLE diputados (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    legislador_id BIGINT REFERENCES legisladores(id) ON DELETE SET NULL,
    distrito INTEGER NOT NULL
)

CREATE TABLE senadores (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    legislador_id BIGINT REFERENCES legisladores(id) ON DELETE SET NULL,
    circunscripcion INTEGER NOT NULL
)

CREATE TABLE leyes (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    numero INTEGER NOT NULL,
    nombre TEXT,
    descripcion TEXT
    
);

CREATE TABLE votaciones (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    legislador_id BIGINT REFERENCES legisladores(id) ON DELETE CASCADE,
    ley_id BIGINT REFERENCES leyes(id) ON DELETE CASCADE,
    fecha_votacion DATE,
    voto TEXT
);


        nombre,
        email,
        fechaNacimiento: date,
        genero,
        pais,
        rut,
        creadoEn: new Date(),

create TABLE profiles(
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    fecha_nacimiento DATE,
    genero TEXT NOT NULL,
    pais TEXT NOT NULL,
    rut TEXT NOT NULL,
    creado_en timestamptz DEFAULT now()
);

ALTER TABLE profiles 
ADD COLUMN circunscripcion BIGINT REFERENCES regiones(id),
ADD COLUMN distrito INTEGER;


CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, nombre, email, fecha_nacimiento, genero, pais, rut)
    VALUES(
        new.id,
        new.raw_user_meta_data->>'nombre',
        new.email,
        new.raw_user_meta_data->>'fecha_nacimiento'::date,
        new.raw_user_meta_data->>'genero',
        new.raw_user_meta_data->>'pais',
        new.raw_user_meta_data->>'rut'
    )
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user()


--Eliminar trigger y funcion
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();


ALTER TABLE compromisos
ADD COLUMN categoria TEXT;

CREATE TABLE topicos(
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre TEXT NOT NULL
);



INSERT INTO topicos (nombre) VALUES
('Economía'),
('Política'),
('Recursos Naturales'),
('Pesca'),
('Medios de comunicación'),
('Salud'),
('Inmigración'),
('Infancia'),
('Seguridad'),
('Feminismo'),
('Minería'),
('Medio Ambiente'),
('Educación'),
('Patrimonio'),
('Derechos humanos'),
('Tecnología'),
('Agricultura'),
('Sistema Judicial'),
('Vivienda'),
('Cultura'),
('Sistema Previsional'),
('Deporte'),
('Familia'),
('Sustancias psicoactivas'),
('Energía'),
('Ganadería'),
('Leyes laborales'),
('Urbanismo'),
('Política Internacional'),
('Turismo'),
('Defensa nacional'),
('Impuestos'),
('Gobierno'),
('Infancia'),
('Adolescencia'),
('Narcotráfico'),
('Municipalidades'),
('Gobiernos Regionales');


CREATE TABLE user_topicos(
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    topico_id BIGINT REFERENCES topicos(id) ON DELETE CASCADE
    UNIQUE(user_id, topico_id)
);


--admitir target id iguales

create table user_reacciones(
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    target_id text not null,
    target_type text not null,
    tipo_reaccion text not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    UNIQUE(user_id, target_id, target_type)

);


CREATE TABLE usuarios_partidos (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    partido_id BIGINT REFERENCES partidos(id) ON DELETE CASCADE,
    UNIQUE(user_id, partido_id)
)


--convertir fechas

ALTER TABLE asistencia
ADD COLUMN fecha_date date;

UPDATE asistencia
set fecha_date = (
    to_date(
        replace(
        replace(
        replace(
        replace(
        replace(
        replace(
        replace(
        replace(
        replace(
        replace(
        replace(
        replace( lower(fecha),
            'enero', 'january'),
            'febrero', 'february'),
            'marzo', 'march'),
            'abril', 'april'),
            'mayo', 'may'),
            'junio', 'june'),
            'julio', 'july'),
            'agosto', 'august'),
            'septiembre', 'september'),
            'octubre', 'october'),
            'noviembre', 'november'),
            'diciembre', 'december'
        ),
        'DD Month YYYY'
    )
    
);


--funcion trigger para crear fecha_date

create or replace function convertir_fecha_asistencia()
returns trigger
language plpgsql
as $$
BEGIN

    new.fecha_date := to_date(
        replace(
        replace(
        replace(
        replace(
        replace(
        replace(
        replace(
        replace(
        replace(
        replace(
        replace(
        replace( lower(fecha),
            'enero', 'january'),
            'febrero', 'february'),
            'marzo', 'march'),
            'abril', 'april'),
            'mayo', 'may'),
            'junio', 'june'),
            'julio', 'july'),
            'agosto', 'august'),
            'septiembre', 'september'),
            'octubre', 'october'),
            'noviembre', 'november'),
            'diciembre', 'december'
        ),
        'DD Month YYYY'
    );

    return new;
end;
$$;

CREATE TRIGGER trigger_convertir_fecha_asistencia
BEFORE INSERT OR UPDATE ON asistencia
for each ROW
EXECUTE FUNCTION convertir_fecha_asistencia();
    

SELECT count(*) AS total_partido
FROM diputados d
JOIN legisladores l ON l.id = d.legislador_id
WHERE l.partido_id = 5;  

--Saber cuantos diputados de u partido votaron en cada votacion

SELECT
    vd.id_votacion,
    count(vd.id_diputado) AS votaron
FROM votos_diputado vd
JOIN diputados d ON d.id = vd.id_diputado
JOIN legisladores l ON l.id = d.legislador_id
WHERE l.partido_id = 5
GROUP BY vd.id_votacion  



SELECT
    vd.id_votacion,
    count(vd.id_diputado) AS votaron,
    total.total_partido,
    round( count(vd.id_diputado)::numeric / total.total_partido * 100, 1 ) AS porcentaje
FROM votos_diputado vd
JOIN diputados d ON d.id = vd.id_diputado
JOIN legisladores l ON l.id = d.legislador_id

CROSS JOIN (
    SELECT count(*) AS total_partido
    FROM diputados d2
    JOIN legisladores l2 ON l2.id = d2.legislador_id
    WHERE l2.partido_id = 18  
) total
WHERE l.partido_id = 18
GROUP BY vd.id_votacion, total.total_partido 
HAVING round( count(vd.id_diputado)::numeric / total.total_partido * 100, 1 ) < 100


--funcion de participacion historica

create or replace function participacion_historica_partido(p_partido_id integer)
returns numeric as $$
declare
    total_votos_posibles bigint;
    total_votos_emitidos bigint;
begin    

    SELECT count(DISTINCT v.id_votacion) * (
        SELECT count(*) AS total_partido
        FROM diputados d2
        JOIN legisladores l2 ON l2.id = d2.legislador_id
        WHERE l2.partido_id = p_partido_id  
    )
    into total_votos_posibles
    from votaciones v;

    if total_votos_posibles = 0 then
        return 0;
    end if;

    SELECT count(*)
    into total_votos_emitidos
    from votos_diputado vd
    JOIN diputados d ON d.id = vd.id_diputado
    JOIN legisladores l ON l.id = d.legislador_id
    WHERE l.partido_id = p_partido_id
        AND lower(vd.voto) != 'pareos';

    return round( total_votos_emitidos::numeric / total_votos_posibles * 100, 1 );
end;
$$ language plpgsql;
     



--votos posibles
    SELECT count(DISTINCT vd.id_votacion) * (
        SELECT count(*) AS total_partido
        FROM diputados d2
        JOIN legisladores l2 ON l2.id = d2.legislador_id
        WHERE l2.partido_id = 18  
    ) AS total_votos_posibles
    FROM votos_diputado vd;

   
--votos emitidos
    SELECT count(*) as total_votos_emitidos
    from votos_diputado vd
    JOIN diputados d ON d.id = vd.id_diputado
    JOIN legisladores l ON l.id = d.legislador_id
    WHERE l.partido_id = 15;

-- 15 -> 3234

--PAREOS
    SELECT count(*) as total_votos_emitidos_sin_pareos
    from votos_diputado vd
    JOIN diputados d ON d.id = vd.id_diputado
    JOIN legisladores l ON l.id = d.legislador_id
    WHERE l.partido_id = 15
        AND lower(vd.voto) != 'pareos';

-- 15 -> 3101



--participacion historica de un diputado

--denominador
SELECT count(*) AS total_votaciones
FROM votaciones;

--numerador
SELECT count(*) AS votaciones_participadas
FROM votos_diputado vd
WHERE vd.id_diputado = 915
    AND lower(vd.voto) != 'pareos';

--funcion rpc

create or replace function participacion_historica_diputado(p_diputado_id integer)
returns numeric as $$
declare
    total_votaciones bigint;
    votaciones_participadas bigint;
begin

    SELECT count(*) into total_votaciones
    FROM votaciones;

    if total_votaciones = 0 then
        return 0;
    end if;

    SELECT count(*) into votaciones_participadas
    FROM votos_diputado vd
    WHERE vd.id_diputado = p_diputado_id
    AND lower(vd.voto) != 'pareos';

    return round( votaciones_participadas::numeric / total_votaciones * 100, 1 );
end;
$$ language plpgsql;



-- PORCENTAJE DE ATRASOS

SELECT count(*) AS total_registros
FROM asistencia
WHERE id_diputado = 803
    AND hora_ingreso IS NOT NULL
    AND hora_ingreso != '-';

--Total de atrasos

SELECT count(*) AS total_atrasos
FROM asistencia
WHERE id_diputado = 803
    AND hora_ingreso IS NOT NULL
    AND hora_ingreso != '-'
    AND hora_ingreso::time > ( hora_inicio::time + INTERVAL '3 minutes' );

--Funcion RPC

create or replace function porcentaje_atrasos_diputado(p_diputado_id integer)
returns numeric as $$
declare
    total_registros bigint;
    total_atrasos bigint;
begin

    SELECT count(*) into total_registros
    FROM asistencia
    WHERE id_diputado = p_diputado_id
    AND hora_ingreso IS NOT NULL
    AND hora_ingreso != '-';

    if total_registros = 0 then
        return 0;
    end if;

    SELECT count(*) into total_atrasos
    FROM asistencia
    WHERE id_diputado = p_diputado_id
    AND hora_ingreso IS NOT NULL
    AND hora_ingreso != '-'
    AND hora_ingreso::time > ( hora_inicio::time + INTERVAL '3 minutes' );

    return round( total_atrasos::numeric / total_registros * 100, 0 );
end;
$$ language plpgsql;


-- ASISTENCIA DE UN PARTIDO A UNA SESION DETERMINADA

 --Cantidad asistencias e una fecha especifica
 SELECT numero_sesion AS numero_sesion_objetivo
 FROM asistencia
 WHERE fecha_date = '2026-05-20'
 LIMIT 1;

 --obtener sesion registrada
 SELECT max(numero_sesion) AS numero_sesion_objetivo
 FROM asistencia;

 -- Cuantos diputados asistieron a esa sesion
SELECT count(*) as total_asistieron
from asistencia a
JOIN diputados d ON d.id = a.id_diputado
JOIN legisladores l ON l.id = d.legislador_id
WHERE l.partido_id = 15
    AND a.numero_sesion = 27
    AND a.asistencia = 'Asiste';


--Funcion RPC

create or replace function asistencia_partido_sesion(p_partido_id integer, p_fecha date default null)
returns numeric as $$
declare
    numero_sesion_objetivo bigint;
    total_asistieron bigint;
    total_diputados bigint;
begin

    --Si viene fecha, buscamos el numero_sesion de esa fecha
    --Sino buscamos el ultimo numero_sesion registrado

    if p_fecha is not null then
        SELECT numero_sesion into numero_sesion_objetivo
        from asistencia
        WHERE fecha_date = p_fecha
        LIMIT 1;
    else
        SELECT max(numero_sesion) into numero_sesion_objetivo
        FROM asistencia;    
    end if;

    if numero_sesion_objetivo is null then
        return 0;
    end if;

    --Total diputados del partido

    SELECT count(*) into total_diputados
    from diputados d
    JOIN legisladores l ON l.id = d.legislador_id
    WHERE l.partido_id = p_partido_id;

    if total_diputados = 0 then
        return 0;
    end if;

    --Cuantos asistieron a esa sesion
    SELECT count(*) into total_asistieron
    from asistencia a
    JOIN diputados d ON d.id = a.id_diputado
    JOIN legisladores l ON l.id = d.legislador_id
    WHERE l.partido_id = p_partido_id
        AND a.numero_sesion = numero_sesion_objetivo
        AND a.asistencia = 'Asiste';

    return round( total_asistieron::numeric / total_diputados * 100, 0 );
end;
$$ language plpgsql;


--Nuevas columnas para guardar resumen con IA
ALTER TABLE votaciones
ADD COLUMN materia_resumen TEXT NULL;

ALTER TABLE votaciones
ADD COLUMN articulo_resumen TEXT NULL;



--registro dummy para testear edge function

INSERT INTO votaciones (id_votacion, materia)
VALUES (9999, 'La Cámara de Diputadas y Diputados manifiesta su preocupación a S. E. el Presidente de la República por los recortes presupuestarios y medidas de ajuste fiscal impulsadas por el ejecutivo que podrían afectar el funcionamiento de la red pública de salud, especialmente en hospitales, servicios de urgencia y establecimientos asistenciales del país. (Ac.)')


--Funcion rpc para obtener porcetaje de asistencia global
create or replace function asistencia_sesion_global(p_fecha date default null)
returns table(
    porcentaje numeric,
    sesion bigint
) as $$
declare
    sesion_objetivo bigint;
    total_asistieron bigint;
    total_diputados bigint;
begin

    if p_fecha is not null then
        SELECT numero_sesion into sesion_objetivo
        from asistencia
        WHERE fecha_date = p_fecha
        LIMIT 1;
    else
        SELECT max(numero_sesion) into sesion_objetivo
        FROM asistencia;    
    end if;

    if sesion_objetivo is null then
        return query SELECT 0::numeric, null::bigint
        return;
    end if;

    --Total diputados del partido

    SELECT count( DISTINCT id_diputado) into total_diputados
    from asistencia
    where numero_sesion = sesion_objetivo; 

    if total_diputados = 0 then
        return query SELECT 0::numeric, sesion_objetivo
        return;
    end if;

    --Cuantos asistieron a esa sesion
    SELECT count(*) into total_asistieron
    from asistencia
        WHERE numero_sesion = sesion_objetivo
        AND asistencia = 'Asiste';

    return query SELECT
        round( total_asistieron::numeric / total_diputados * 100, 0 ),
        sesion_objetivo;
end;
$$ language plpgsql;


--Funcion rpc para calcular asistencia historica global
create or replace function asistencia_global()
returns numeric as $$
declare
    total bigint;
    presentes bigint;
begin

    SELECT count(*) into total
    from asistencia;

    if total = 0 then
        return 0;
    end if;

    SELECT
        (SELECT count(*) from asistencia where asistencia= 'Asiste')
        + COALESCE((
            SELECT sum(ausencias_justificadas)
            from asistencia_resumen
        ), 0)
    into presentes;

    return round( presentes::numeric / total * 100, 0 );

end;
$$ language plpgsql;

--RPC para obtener porcentajes de participacion partidos por sesion

create or replace function participacion_partidos_por_sesion(p_numero_sesion integer)
returns table(
    id_votacion      integer,
    tipo_documento   text,
    fecha_texto      text,
    resultado        text,
    materia_resumen  text,
    articulo_resumen text,
    partido_id       bigint,
    pct_favor        numeric,
    pct_contra       numeric
) as $$
begin
    return query
    select
        v.id_votacion,
        v.tipo_documento,
        v.fecha_texto,
        v.resultado,
        v.materia_resumen,
        v.articulo_resumen,
        l.partido_id,

        coalesce(round(
            count(distinct case when vd.voto ilike '%favor%' then vd.id_diputado end)::numeric
            / nullif((
                select count(*) from diputados d2
                join legisladores l2 on l2.id = d2.legislador_id
                where l2.partido_id = l.partido_id
            ), 0) * 100
        , 0), 0) as pct_favor,

        coalesce(round(
            count(distinct case when vd.voto ilike '%contra%' then vd.id_diputado end)::numeric
            / nullif((
                select count(*) from diputados d2
                join legisladores l2 on l2.id = d2.legislador_id
                where l2.partido_id = l.partido_id
            ), 0) * 100
        , 0), 0) as pct_contra

    from votos_diputado vd
    join votaciones v   on v.id_votacion = vd.id_votacion
    join diputados d    on d.id = vd.id_diputado
    join legisladores l on l.id = d.legislador_id
    where v.sesion ilike '%n°' || p_numero_sesion || ',%'
    group by v.id_votacion, v.tipo_documento, v.fecha_texto, v.resultado,
             v.materia_resumen, v.articulo_resumen, l.partido_id
    order by v.id_votacion, l.partido_id;
end;
$$ language plpgsql;



--SELECT POR ID VOTACIO Y ID PARTIDO

SELECT
    COALESCE(
        round(
            count( DISTINCT case when lower(vd.voto) = 'a favor' then vd.id_diputado end )::numeric
            /
            nullif(
                (
                    SELECT count(*)
                    FROM diputados d2
                    JOIN legisladores l2 ON l2.id = d2.legislador_id
                    WHERE l2.partido_id = 18  

                ), 0
            ) * 100,
    0),0) as pct_favor,

    COALESCE(
        round(
            count( DISTINCT case when lower(vd.voto) = 'en contra' then vd.id_diputado end )::numeric
            /
            nullif(
                (
                    SELECT count(*)
                    FROM diputados d2
                    JOIN legisladores l2 ON l2.id = d2.legislador_id
                    WHERE l2.partido_id = 18  

                ), 0
            ) * 100,
    0),0) as pct_contra

from votos_diputado vd
JOIN diputados d ON d.id = vd.id_diputado
JOIN legisladores l ON l.id = d.legislador_id
where vd.id_votacion = 89105
    and l.partido_id = 18;



SELECT vd.id_diputado, vd.voto, l.partido_id
from votos_diputado vd
JOIN diputados d ON d.id = vd.id_diputado
JOIN legisladores l ON l.id = d.legislador_id
where vd.id_votacion = 89105
    and l.partido_id = 8;



--Cuantas votaciones tiene la sesion
SELECT id_votacion, sesion
from votaciones
where sesion ilike '%n°32,%'
order by id_votacion;


--diputados de cada partido
select l.partido_id, count(*) as total_diputados
from diputados d
join legisladores l on l.id = d.legislador_id
group by l.partido_id
order by l.partido_id;


--



SELECT 
    l.partido_id,
    count( DISTINCT case when vd.voto ILIKE '%favor%' then vd.id_diputado end ) as favor_unicos,
    (SELECT count(*) from diputados d2
    join legisladores l2 on l2.id = d2.legislador_id
    where l2.partido_id = l.partido_id) as total_partido
from votos_diputado vd
join votaciones v on v.id_votacion = vd.id_votacion
JOIN diputados d ON d.id = vd.id_diputado
JOIN legisladores l ON l.id = d.legislador_id
where v.sesion ilike '%n°32,%'
GROUP by l.partido_id
ORDER by l.partido_id;


--SELECT AGRUPANDO POR VOTACION INDIVUAL

SELECT
    v.id_votacion,
    l.partido_id,
    count( DISTINCT case when vd.voto ILIKE '%favor%' then vd.id_diputado end ) as favor_unicos,
    count( DISTINCT case when vd.voto ILIKE '%contra%' then vd.id_diputado end ) as contra_unicos,
    (SELECT count(*) from diputados d2
    join legisladores l2 on l2.id = d2.legislador_id
    where l2.partido_id = l.partido_id) as total_partido
from votos_diputado vd
join votaciones v on v.id_votacion = vd.id_votacion
JOIN diputados d ON d.id = vd.id_diputado
JOIN legisladores l ON l.id = d.legislador_id
where v.sesion ilike '%n°32,%'
GROUP by v.id_votacion, l.partido_id
ORDER by v.id_votacion, l.partido_id;


--SELECT POR VOTACION INDIVIDUAL
SELECT 
    v.id_votacion,
    l.partido_id,
    COUNT( DISTINCT CASE WHEN vd.voto ILIKE '%favor%' THEN vd.id_diputado END ) AS favor_unicos,
    COUNT( DISTINCT CASE WHEN vd.voto ILIKE '%contra%' THEN vd.id_diputado END ) AS contra_unicos,
    COUNT( DISTINCT vd.id_diputado ) AS total_votaron_en_sala,
    (SELECT COUNT(*) FROM diputados d2
     JOIN legisladores l2 ON l2.id = d2.legislador_id
     WHERE l2.partido_id = l.partido_id) AS total_teorico_partido
FROM votos_diputado vd
JOIN votaciones v   ON v.id_votacion = vd.id_votacion
JOIN diputados d    ON d.id = vd.id_diputado
JOIN legisladores l ON l.id = d.legislador_id
WHERE v.id_votacion = 89104
GROUP BY v.id_votacion, l.partido_id
ORDER BY l.partido_id;




id_diputado id_votacion voto
1           100         a favor
1           101         a favor
2           100         en contra
2           101         a favor
3           100         a favor
3           101         en contra

4 / 3 * 100 = 133%


--RPC para obtener votos de un partido por sesion

create or replace function votos_partido_por_sesion(p_numero_sesion integer, p_partido_id integer)
returns table(
    id_votacion      integer,
    id_diputado      bigint,
    url_img          text,
    nombre           text,
    voto             text
) as $$
begin

    return query
    SELECT
        v.id_votacion,
        l.id,
        l.url_img,
        l.nombre,
        vd.voto
    from votos_diputado vd
    join votaciones v on v.id_votacion = vd.id_votacion
    join diputados d on d.id = vd.id_diputado
    join legisladores l on l.id = d.legislador_id
    where v.sesion ilike '%n°' || p_numero_sesion || ',%'
        and l.partido_id = p_partido_id
    order by v.id_votacion, l.id;

end;
$$ language plpgsql;


--RPC para obtener porcentaje de participacion de un partido en una sesion especifica

create or replace function votacion_partido_por_sesion(p_numero_sesion integer, p_partido_id integer)
returns numeric as $$
declare
    total_diputados bigint;
    total_posible bigint;
    total_emitidos bigint;
begin

    SELECT count(*) into total_diputados
    from diputados d
    JOIN legisladores l ON l.id = d.legislador_id
    WHERE l.partido_id = p_partido_id;

    if total_diputados = 0 then return 0; end if;


    SELECT count(DISTINCT v.id_votacion) * total_diputados
    into total_posible
    from votaciones v
    where v.sesion ilike '%n°' || p_numero_sesion || ',%';

    if total_posible = 0 then return 0; end if;

    SELECT count(*)
    into total_emitidos
    from votos_diputado vd
    join votaciones v ON v.id_votacion = vd.id_votacion
    JOIN diputados d ON d.id = vd.id_diputado
    JOIN legisladores l ON l.id = d.legislador_id
    where v.sesion ilike '%n°' || p_numero_sesion || ',%'
        and l.partido_id = p_partido_id
        AND lower(vd.voto) != 'pareos'; 

    return round( total_emitidos::numeric / total_posible * 100, 0 );
end;
$$ language plpgsql;


--RPC para obtener porcentaje de participacion de diputados de un partido especifico por sesion

id_votacion
100          1      A favor
100          2      Pareo
100          3      contra




create or replace function votacion_diputados_por_sesion(p_numero_sesion integer, p_partido_id integer)
returns table(
    id_diputado      bigint,
    nombre           text,
    url_img          text,
    porcentaje       numeric
) as $$

declare
    total_votaciones bigint;
begin


    SELECT count(DISTINCT id_votacion) into total_votaciones
    from votaciones
    where sesion ilike '%n°' || p_numero_sesion || ',%';

    if total_votaciones = 0 then return 0; end if;

    return query 
    select
        l.id,
        l.nombre,
        l.url_img,
        coalesce( round(
            count (distinct case when lower(vd.voto) != 'pareos' then vd.id_votacion end)::numeric
            / nullif(total_votaciones, 0) * 100
        , 0), 0)
    from diputados d
    join legisladores l on l.id = d.legislador_id

    left join votos_diputado vd on vd.id_diputado = d.id

        and vd.id_votacion IN (
            SELECT id_votacion
            from votaciones v
            where v.sesion ilike '%n°' || p_numero_sesion || ',%'
        )

    where l.partido_id = p_partido_id
    group by l.id, l.nombre, l.url_img
    order by l.nombre;
end;
$$ language plpgsql;


--RPC para obtener participacion historica de diputados

create or replace function participacion_historica_diputado_por_partido(p_partido_id integer)
returns table(
    id_diputado      bigint,
    porcentaje       numeric
) as $$

declare
    total_votaciones bigint;
begin


    SELECT count(*) into total_votaciones
    from votaciones;

    if total_votaciones = 0 then return; end if;

    return query 
    select
        l.id,
        coalesce( round(
            count (distinct case when lower(vd.voto) != 'pareos' then vd.id_votacion end)::numeric
            / nullif(total_votaciones, 0) * 100
        , 0), 0)
    from diputados d
    join legisladores l on l.id = d.legislador_id

    left join votos_diputado vd on vd.id_diputado = d.id

    where l.partido_id = p_partido_id
    group by l.id
    order by l.id;
end;
$$ language plpgsql;


--Funcion rpc para calcular participacion historica global votaciones
create or replace function participacion_historica_global(p_numero_sesion integer)
returns numeric as $$
declare
    total_posible bigint;
    total_emitidos bigint;
    total_diputados bigint;
    total_votaciones bigint;
begin

    SELECT count(*) into total_diputados from diputados;
    
    SELECT count(DISTINCT id_votacion) into total_votaciones
    from votaciones
    where sesion ilike '%n°' || p_numero_sesion || ',%';

    total_posible = total_diputados * total_votaciones;


    if total_posible = 0 then
        return 0;
    end if;

    select count(*) into total_emitidos
    from votos_diputado vd
    where lower(vd.voto) != 'pareos'
    and vd.id_votacion IN (
        SELECT id_votacion
        from votaciones v
        where v.sesion ilike '%n°' || p_numero_sesion || ',%'
    )

    return round( total_emitidos::numeric / total_posible * 100, 0 );
end;
$$ language plpgsql;


--Funcion rpc para obtener numero de mociones agrupadas por partido politico
create or replace function mociones_por_partido()
returns table(
    partido_id       integer,
    total_mociones   bigint
) as $$
begin
    return query
    SELECT
        p.id,
        count(DISTINCT m.numero_boletin) as total_mociones
    from partidos p
    join legisladores l on l.partido_id = p.id
    join diputados d on d.legislador_id = l.id
    join diputado_mociones dm on dm.id_diputado = d.id
    join mociones m on m.numero_boletin = dm.id_mocion
    group by p.id;
end;
$$ language plpgsql;