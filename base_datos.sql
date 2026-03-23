CREATE TABLE comunas (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre TEXT NOT NULL,
    region_id BIGINT REFERENCES regiones(id) ON DELETE CASCADE
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



