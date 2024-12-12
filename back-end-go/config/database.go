package config

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func InitializeDatabase() (*sql.DB, error) {
		dsn := "root@tcp(127.0.0.1:3306)/homalink"
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