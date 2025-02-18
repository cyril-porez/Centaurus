package config

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func InitializeDatabase(url string) (*sql.DB, error) {
		dsn := url /* docker: root:mysql@tcp(mysql:3306)/centaurus */ /* local: root@tcp(127.0.0.1:3306)/centaurus */
		db, err := sql.Open("mysql", dsn)
		if err != nil {
			return nil, err
		}

		err = db.Ping()
		if err != nil {
			return nil, err
		}

		log.Println("Connexion réussie à la BDD")
		return db, nil
}