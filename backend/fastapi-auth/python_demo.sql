--
-- PostgreSQL database dump
--

\restrict Tq6FSFgPPbzwehEEHBpQ25kkqMCpvFqo8zgZUE6UzeHWqQezQjj3umsfnFDXMzb

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-10-05 19:23:12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 49153)
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 49157)
-- Name: dossier_modules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dossier_modules (
    id integer NOT NULL,
    dossier_id integer NOT NULL,
    module_number character varying(20) NOT NULL,
    module_name character varying(255) NOT NULL,
    description text,
    status character varying(50) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.dossier_modules OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 49169)
-- Name: dossier_modules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dossier_modules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dossier_modules_id_seq OWNER TO postgres;

--
-- TOC entry 5076 (class 0 OID 0)
-- Dependencies: 221
-- Name: dossier_modules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dossier_modules_id_seq OWNED BY public.dossier_modules.id;


--
-- TOC entry 222 (class 1259 OID 49170)
-- Name: dossiers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dossiers (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    status character varying(50) NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.dossiers OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 49181)
-- Name: dossiers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dossiers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dossiers_id_seq OWNER TO postgres;

--
-- TOC entry 5077 (class 0 OID 0)
-- Dependencies: 223
-- Name: dossiers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dossiers_id_seq OWNED BY public.dossiers.id;


--
-- TOC entry 224 (class 1259 OID 49182)
-- Name: leave_balances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_balances (
    id integer NOT NULL,
    user_id integer NOT NULL,
    leave_type_id integer NOT NULL,
    allocated_days integer NOT NULL,
    used_days integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.leave_balances OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 49194)
-- Name: leave_balances_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leave_balances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_balances_id_seq OWNER TO postgres;

--
-- TOC entry 5078 (class 0 OID 0)
-- Dependencies: 225
-- Name: leave_balances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leave_balances_id_seq OWNED BY public.leave_balances.id;


--
-- TOC entry 226 (class 1259 OID 49195)
-- Name: leave_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_comments (
    id integer NOT NULL,
    leave_id integer NOT NULL,
    user_id integer NOT NULL,
    comment text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.leave_comments OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 49206)
-- Name: leave_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leave_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_comments_id_seq OWNER TO postgres;

--
-- TOC entry 5079 (class 0 OID 0)
-- Dependencies: 227
-- Name: leave_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leave_comments_id_seq OWNED BY public.leave_comments.id;


--
-- TOC entry 228 (class 1259 OID 49207)
-- Name: leave_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_types (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(500),
    total_days integer NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.leave_types OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 49220)
-- Name: leave_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leave_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_types_id_seq OWNER TO postgres;

--
-- TOC entry 5080 (class 0 OID 0)
-- Dependencies: 229
-- Name: leave_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leave_types_id_seq OWNED BY public.leave_types.id;


--
-- TOC entry 230 (class 1259 OID 49221)
-- Name: leaves; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leaves (
    id integer NOT NULL,
    user_id integer NOT NULL,
    leave_type_id integer NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    total_days integer NOT NULL,
    reason text,
    status character varying(30) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    approved_by integer,
    approved_at timestamp with time zone,
    rejected_by integer,
    rejected_at timestamp with time zone
);


ALTER TABLE public.leaves OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 49237)
-- Name: leaves_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leaves_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leaves_id_seq OWNER TO postgres;

--
-- TOC entry 5081 (class 0 OID 0)
-- Dependencies: 231
-- Name: leaves_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leaves_id_seq OWNED BY public.leaves.id;


--
-- TOC entry 232 (class 1259 OID 49238)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(255),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 49245)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 5082 (class 0 OID 0)
-- Dependencies: 233
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 234 (class 1259 OID 49246)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    is_active boolean NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    role_id integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 49257)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5083 (class 0 OID 0)
-- Dependencies: 235
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4849 (class 2604 OID 49258)
-- Name: dossier_modules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dossier_modules ALTER COLUMN id SET DEFAULT nextval('public.dossier_modules_id_seq'::regclass);


--
-- TOC entry 4850 (class 2604 OID 49259)
-- Name: dossiers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dossiers ALTER COLUMN id SET DEFAULT nextval('public.dossiers_id_seq'::regclass);


--
-- TOC entry 4851 (class 2604 OID 49260)
-- Name: leave_balances id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_balances ALTER COLUMN id SET DEFAULT nextval('public.leave_balances_id_seq'::regclass);


--
-- TOC entry 4854 (class 2604 OID 49261)
-- Name: leave_comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_comments ALTER COLUMN id SET DEFAULT nextval('public.leave_comments_id_seq'::regclass);


--
-- TOC entry 4856 (class 2604 OID 49262)
-- Name: leave_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_types ALTER COLUMN id SET DEFAULT nextval('public.leave_types_id_seq'::regclass);


--
-- TOC entry 4859 (class 2604 OID 49263)
-- Name: leaves id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaves ALTER COLUMN id SET DEFAULT nextval('public.leaves_id_seq'::regclass);


--
-- TOC entry 4862 (class 2604 OID 49264)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 4863 (class 2604 OID 49265)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5054 (class 0 OID 49153)
-- Dependencies: 219
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alembic_version (version_num) FROM stdin;
29505a396dd9
\.


--
-- TOC entry 5055 (class 0 OID 49157)
-- Dependencies: 220
-- Data for Name: dossier_modules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dossier_modules (id, dossier_id, module_number, module_name, description, status, created_at, updated_at) FROM stdin;
2	1	2	Summaries	CTD summaries	NOT_STARTED	2026-09-27 12:26:49.140506+05:30	2026-09-27 12:26:49.14051+05:30
3	1	3	Quality	Quality related information	NOT_STARTED	2026-09-27 12:26:57.14101+05:30	2026-09-27 12:26:57.141018+05:30
5	1	5	Clinical Study Reports	Clinical study documentation	NOT_STARTED	2026-09-27 12:27:31.819032+05:30	2026-09-27 12:27:31.819039+05:30
4	1	string	string	string	NOT_STARTED	2026-09-27 12:27:04.68366+05:30	2026-09-27 12:29:21.807046+05:30
1	1	1	Administrative Information	Administrative and regional information	IN_PROGRESS	2026-09-27 12:26:33.991071+05:30	2026-09-27 14:00:12.102733+05:30
\.


--
-- TOC entry 5057 (class 0 OID 49170)
-- Dependencies: 222
-- Data for Name: dossiers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dossiers (id, name, description, status, created_by, created_at, updated_at) FROM stdin;
1	Paracetamol 500mg Updated Dossier	Regulatory dossier for Paracetamol 500mg	DRAFT	1	2026-09-27 12:24:28.239465+05:30	2026-09-27 12:25:31.069237+05:30
\.


--
-- TOC entry 5059 (class 0 OID 49182)
-- Dependencies: 224
-- Data for Name: leave_balances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_balances (id, user_id, leave_type_id, allocated_days, used_days, created_at, updated_at) FROM stdin;
1	1	1	12	3	2026-09-24 15:26:39.309224+05:30	2026-09-24 15:32:50.194196+05:30
2	2	1	12	0	2026-09-25 10:22:14.721243+05:30	2026-09-25 10:22:14.721243+05:30
3	1	2	10	0	2026-09-25 10:22:43.35405+05:30	2026-09-25 10:22:43.35405+05:30
\.


--
-- TOC entry 5061 (class 0 OID 49195)
-- Dependencies: 226
-- Data for Name: leave_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_comments (id, leave_id, user_id, comment, created_at) FROM stdin;
2	2	1	Test Comment	2026-09-25 10:23:22.195313+05:30
3	1	2	Confirmed	2026-09-25 10:55:02.849842+05:30
1	1	1	Please confirm the leave dates.	2026-09-24 15:32:23.256478+05:30
\.


--
-- TOC entry 5063 (class 0 OID 49207)
-- Dependencies: 228
-- Data for Name: leave_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_types (id, name, description, total_days, is_active, created_at, updated_at) FROM stdin;
1	Casual Leave	Casual leave for personal work	12	t	2026-09-24 15:23:55.984348+05:30	2026-09-24 15:23:55.984348+05:30
2	Sick Leave	Leave for illness	10	t	2026-09-24 15:24:12.058781+05:30	2026-09-24 15:24:12.058781+05:30
\.


--
-- TOC entry 5065 (class 0 OID 49221)
-- Dependencies: 230
-- Data for Name: leaves; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leaves (id, user_id, leave_type_id, start_date, end_date, total_days, reason, status, created_at, updated_at, approved_by, approved_at, rejected_by, rejected_at) FROM stdin;
1	1	1	2026-10-05	2026-10-07	3	Personal work	approved	2026-09-24 15:30:41.290498+05:30	2026-09-24 15:32:50.194196+05:30	\N	\N	\N	\N
2	1	2	2026-09-25	2026-09-26	2	Sick leave	cancelled	2026-09-25 10:23:13.976549+05:30	2026-09-25 10:34:53.321771+05:30	\N	\N	\N	\N
\.


--
-- TOC entry 5067 (class 0 OID 49238)
-- Dependencies: 232
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, description, created_at, updated_at) FROM stdin;
1	EMPLOYEE	Regular employee	2026-09-24 09:14:53.79037	2026-09-24 09:14:53.790376
2	MANAGER	Manager who reviews leave requests	2026-09-24 09:15:42.74553	2026-09-24 09:15:42.745537
3	HR	Human resources	2026-09-24 09:16:14.360153	2026-09-24 09:16:14.36016
4	Admin	Administrator	2026-09-24 11:27:58.494435	2026-09-24 11:27:58.49445
\.


--
-- TOC entry 5069 (class 0 OID 49246)
-- Dependencies: 234
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, first_name, last_name, is_active, created_at, updated_at, role_id) FROM stdin;
1	kavitabavadiya@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$vXduzVmLMYbQ+j+HUApBSA$WGQN2s/TFdoIkEuabq0nOiG9eXKvRFPC5+/2F4zCyHA	Kavita	Bavadiya	t	2026-09-10 09:18:23.728465	2026-09-24 10:21:28.536932	1
2	vairag@gmail.com	$argon2id$v=19$m=65536,t=3,p=4$Gzbf2jQf+lscgzYqpp3vlQ$3jOXXhUj4vOi1G2cCbfV2HUdLGCRMBLhWHfItqRfYho	Vairag	Bavadiya	t	2026-09-10 09:38:48.846571	2026-09-10 09:38:48.846577	4
\.


--
-- TOC entry 5084 (class 0 OID 0)
-- Dependencies: 221
-- Name: dossier_modules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dossier_modules_id_seq', 5, true);


--
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 223
-- Name: dossiers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dossiers_id_seq', 1, true);


--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 225
-- Name: leave_balances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leave_balances_id_seq', 3, true);


--
-- TOC entry 5087 (class 0 OID 0)
-- Dependencies: 227
-- Name: leave_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leave_comments_id_seq', 3, true);


--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 229
-- Name: leave_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leave_types_id_seq', 2, true);


--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 231
-- Name: leaves_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leaves_id_seq', 2, true);


--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 233
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 4, true);


--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 235
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- TOC entry 4865 (class 2606 OID 49267)
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- TOC entry 4867 (class 2606 OID 49269)
-- Name: dossier_modules dossier_modules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dossier_modules
    ADD CONSTRAINT dossier_modules_pkey PRIMARY KEY (id);


--
-- TOC entry 4871 (class 2606 OID 49271)
-- Name: dossiers dossiers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dossiers
    ADD CONSTRAINT dossiers_pkey PRIMARY KEY (id);


--
-- TOC entry 4875 (class 2606 OID 49273)
-- Name: leave_balances leave_balances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_balances
    ADD CONSTRAINT leave_balances_pkey PRIMARY KEY (id);


--
-- TOC entry 4878 (class 2606 OID 49275)
-- Name: leave_comments leave_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_comments
    ADD CONSTRAINT leave_comments_pkey PRIMARY KEY (id);


--
-- TOC entry 4881 (class 2606 OID 49277)
-- Name: leave_types leave_types_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_types
    ADD CONSTRAINT leave_types_name_key UNIQUE (name);


--
-- TOC entry 4883 (class 2606 OID 49279)
-- Name: leave_types leave_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_types
    ADD CONSTRAINT leave_types_pkey PRIMARY KEY (id);


--
-- TOC entry 4886 (class 2606 OID 49281)
-- Name: leaves leaves_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaves
    ADD CONSTRAINT leaves_pkey PRIMARY KEY (id);


--
-- TOC entry 4890 (class 2606 OID 49283)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4895 (class 2606 OID 49285)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4868 (class 1259 OID 49286)
-- Name: ix_dossier_modules_dossier_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_dossier_modules_dossier_id ON public.dossier_modules USING btree (dossier_id);


--
-- TOC entry 4869 (class 1259 OID 49287)
-- Name: ix_dossier_modules_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_dossier_modules_id ON public.dossier_modules USING btree (id);


--
-- TOC entry 4872 (class 1259 OID 49288)
-- Name: ix_dossiers_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_dossiers_id ON public.dossiers USING btree (id);


--
-- TOC entry 4873 (class 1259 OID 49289)
-- Name: ix_leave_balances_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_leave_balances_id ON public.leave_balances USING btree (id);


--
-- TOC entry 4876 (class 1259 OID 49290)
-- Name: ix_leave_comments_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_leave_comments_id ON public.leave_comments USING btree (id);


--
-- TOC entry 4879 (class 1259 OID 49291)
-- Name: ix_leave_types_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_leave_types_id ON public.leave_types USING btree (id);


--
-- TOC entry 4884 (class 1259 OID 49292)
-- Name: ix_leaves_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_leaves_id ON public.leaves USING btree (id);


--
-- TOC entry 4887 (class 1259 OID 49293)
-- Name: ix_roles_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_roles_id ON public.roles USING btree (id);


--
-- TOC entry 4888 (class 1259 OID 49294)
-- Name: ix_roles_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_roles_name ON public.roles USING btree (name);


--
-- TOC entry 4891 (class 1259 OID 49295)
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- TOC entry 4892 (class 1259 OID 49296)
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- TOC entry 4893 (class 1259 OID 49297)
-- Name: ix_users_role_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_role_id ON public.users USING btree (role_id);


--
-- TOC entry 4896 (class 2606 OID 49298)
-- Name: dossier_modules dossier_modules_dossier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dossier_modules
    ADD CONSTRAINT dossier_modules_dossier_id_fkey FOREIGN KEY (dossier_id) REFERENCES public.dossiers(id) ON DELETE CASCADE;


--
-- TOC entry 4897 (class 2606 OID 49303)
-- Name: dossiers dossiers_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dossiers
    ADD CONSTRAINT dossiers_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- TOC entry 4898 (class 2606 OID 49308)
-- Name: leave_balances leave_balances_leave_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_balances
    ADD CONSTRAINT leave_balances_leave_type_id_fkey FOREIGN KEY (leave_type_id) REFERENCES public.leave_types(id) ON DELETE CASCADE;


--
-- TOC entry 4899 (class 2606 OID 49313)
-- Name: leave_balances leave_balances_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_balances
    ADD CONSTRAINT leave_balances_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4900 (class 2606 OID 49318)
-- Name: leave_comments leave_comments_leave_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_comments
    ADD CONSTRAINT leave_comments_leave_id_fkey FOREIGN KEY (leave_id) REFERENCES public.leaves(id) ON DELETE CASCADE;


--
-- TOC entry 4901 (class 2606 OID 49323)
-- Name: leave_comments leave_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_comments
    ADD CONSTRAINT leave_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4902 (class 2606 OID 49328)
-- Name: leaves leaves_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaves
    ADD CONSTRAINT leaves_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 4903 (class 2606 OID 49333)
-- Name: leaves leaves_leave_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaves
    ADD CONSTRAINT leaves_leave_type_id_fkey FOREIGN KEY (leave_type_id) REFERENCES public.leave_types(id) ON DELETE RESTRICT;


--
-- TOC entry 4904 (class 2606 OID 49338)
-- Name: leaves leaves_rejected_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaves
    ADD CONSTRAINT leaves_rejected_by_fkey FOREIGN KEY (rejected_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 4905 (class 2606 OID 49343)
-- Name: leaves leaves_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaves
    ADD CONSTRAINT leaves_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4906 (class 2606 OID 49348)
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


-- Completed on 2026-10-05 19:23:13

--
-- PostgreSQL database dump complete
--

\unrestrict Tq6FSFgPPbzwehEEHBpQ25kkqMCpvFqo8zgZUE6UzeHWqQezQjj3umsfnFDXMzb

