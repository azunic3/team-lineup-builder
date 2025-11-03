# team-lineup-building
A simple app built for interview task. 
Instructions to run the app on Your machine:

1. clone the repository: git clone https://github.com/azunic3/team_lineup_builder.git 
cd team-lineup-builder 
2. folder client is for frontend and folder server is for backend
3. for frontend I used React (Vite) and for backend Node.js + Express and for DB PostgreSQL 
4. install dependencies: cd client
			                   npm install
       			             cd ../server
			                   npm install
5. create DB named lineups_db in postgreSQL (look for instructions in Database_instructions.pdf)
6. run the SQL script to import all tables and sample data: psql -U postgres -d lineups_db -f database/lineups_db_dump.sql
5.run both at the same time using npm run dev
7. open http://localhost:5173 
8. backend is running on port 3000
