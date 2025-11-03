--
-- PostgreSQL database dump
--

\restrict hPe7cdcEGhSJUCpArdN7RIChg936LCS0h2FBpKhPVT1f2sBc8418jNAGrZIVEg3

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-03 17:46:14

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
-- TOC entry 223 (class 1259 OID 16414)
-- Name: lineup_players; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lineup_players (
    lineup_id integer NOT NULL,
    player_id integer NOT NULL
);


ALTER TABLE public.lineup_players OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16404)
-- Name: lineups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lineups (
    id integer NOT NULL,
    sport text NOT NULL
);


ALTER TABLE public.lineups OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16403)
-- Name: lineups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lineups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lineups_id_seq OWNER TO postgres;

--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 221
-- Name: lineups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lineups_id_seq OWNED BY public.lineups.id;


--
-- TOC entry 224 (class 1259 OID 16431)
-- Name: player_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.player_stats (
    player_id integer NOT NULL,
    count integer DEFAULT 0
);


ALTER TABLE public.player_stats OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16391)
-- Name: players; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.players (
    id integer NOT NULL,
    full_name text NOT NULL,
    sport character varying(50)
);


ALTER TABLE public.players OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16390)
-- Name: players_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.players_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.players_id_seq OWNER TO postgres;

--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 219
-- Name: players_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.players_id_seq OWNED BY public.players.id;


--
-- TOC entry 4824 (class 2604 OID 16407)
-- Name: lineups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lineups ALTER COLUMN id SET DEFAULT nextval('public.lineups_id_seq'::regclass);


--
-- TOC entry 4823 (class 2604 OID 16394)
-- Name: players id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players ALTER COLUMN id SET DEFAULT nextval('public.players_id_seq'::regclass);


--
-- TOC entry 4990 (class 0 OID 16414)
-- Dependencies: 223
-- Data for Name: lineup_players; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lineup_players (lineup_id, player_id) FROM stdin;
1	5
1	6
2	7
2	8
2	9
3	12
3	13
3	14
4	19
5	21
5	22
6	24
6	25
6	26
7	38
7	37
8	39
8	41
8	40
9	43
9	44
9	42
\.


--
-- TOC entry 4989 (class 0 OID 16404)
-- Dependencies: 222
-- Data for Name: lineups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lineups (id, sport) FROM stdin;
1	Basketball
2	Football
3	Baseball
4	Baseball
5	Football
6	Basketball
7	Basketball
8	Baseball
9	Baseball
\.


--
-- TOC entry 4991 (class 0 OID 16431)
-- Dependencies: 224
-- Data for Name: player_stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.player_stats (player_id, count) FROM stdin;
5	0
6	0
7	0
8	0
9	0
10	0
11	0
12	0
13	0
14	0
15	0
16	0
17	0
18	0
19	0
20	0
21	0
22	0
23	0
24	0
25	0
26	0
27	0
28	0
29	0
30	0
38	1
39	12
41	10
40	9
37	8
36	7
35	6
34	5
33	4
32	3
31	2
43	1
44	1
42	1
48	0
\.


--
-- TOC entry 4987 (class 0 OID 16391)
-- Dependencies: 220
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.players (id, full_name, sport) FROM stdin;
5	Michael Jordan	Basketball
6	Larry Bird	Basketball
7	Tom Brady	Football
8	Peyton Manning	Football
9	Aaron Rodgers	Football
10	Patrick Mahomes	Football
11	Joe Montana	Football
12	Babe Ruth	Baseball
13	Jackie Robinson	Baseball
14	Derek Jeter	Baseball
15	Hank Aaron	Baseball
16	Mike Trout	Baseball
17	novi player	Basketball
18	dodaj novi	Basketball
19	dodaj noviazz	Baseball
20	dodaj novog	Basketball
21	leo messi 	Football
22	ronaldo crist	Football
23	igrac Smith	Football
24	lisa kudrow	Basketball
25	rachel green	Basketball
26	ross geller	Basketball
27	jow Smith	Basketball
28	neki Johnson	Basketball
29	player Brown	Basketball
30	chandler bingg	Baseball
31	edin dzeko	Basketball
32	miralem pjanic	Football
33	joe novopr	Baseball
34	ross gelllller	Baseball
35	faliime prezime	Basketball
36	obama player	Baseball
37	luka jovici	Basketball
38	luk doncic	Basketball
39	igracc john	Baseball
40	novog igraca	Baseball
41	muhamed moo	Baseball
42	test proba	Baseball
43	kuca test	Baseball
44	neznam imena	Baseball
48	proba test	Football
\.


--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 221
-- Name: lineups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lineups_id_seq', 9, true);


--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 219
-- Name: players_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.players_id_seq', 48, true);


--
-- TOC entry 4833 (class 2606 OID 16420)
-- Name: lineup_players lineup_players_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lineup_players
    ADD CONSTRAINT lineup_players_pkey PRIMARY KEY (lineup_id, player_id);


--
-- TOC entry 4831 (class 2606 OID 16413)
-- Name: lineups lineups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lineups
    ADD CONSTRAINT lineups_pkey PRIMARY KEY (id);


--
-- TOC entry 4835 (class 2606 OID 16437)
-- Name: player_stats player_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_stats
    ADD CONSTRAINT player_stats_pkey PRIMARY KEY (player_id);


--
-- TOC entry 4827 (class 2606 OID 16402)
-- Name: players players_full_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_full_name_key UNIQUE (full_name);


--
-- TOC entry 4829 (class 2606 OID 16400)
-- Name: players players_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (id);


--
-- TOC entry 4836 (class 2606 OID 16421)
-- Name: lineup_players lineup_players_lineup_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lineup_players
    ADD CONSTRAINT lineup_players_lineup_id_fkey FOREIGN KEY (lineup_id) REFERENCES public.lineups(id) ON DELETE CASCADE;


--
-- TOC entry 4837 (class 2606 OID 16426)
-- Name: lineup_players lineup_players_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lineup_players
    ADD CONSTRAINT lineup_players_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


--
-- TOC entry 4838 (class 2606 OID 16438)
-- Name: player_stats player_stats_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_stats
    ADD CONSTRAINT player_stats_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.players(id) ON DELETE CASCADE;


-- Completed on 2025-11-03 17:46:14

--
-- PostgreSQL database dump complete
--

\unrestrict hPe7cdcEGhSJUCpArdN7RIChg936LCS0h2FBpKhPVT1f2sBc8418jNAGrZIVEg3

