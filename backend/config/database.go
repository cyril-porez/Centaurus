package config

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/go-sql-driver/mysql"
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

func EnsureDatabaseAndConnect(dsn, dbName string) (*sql.DB, error) {
	// parse DSN
	cfg, err := mysql.ParseDSN(dsn)
	if err != nil {
		return nil, fmt.Errorf("parse DSN: %w", err)
	}

	// connexion serveur sans DB
	serverCfg := *cfg
	serverCfg.DBName = ""
	serverDB, err := sql.Open("mysql", serverCfg.FormatDSN())
	if err != nil {
		return nil, fmt.Errorf("connect server (no DB): %w", err)
	}
	defer serverDB.Close()

	if err := serverDB.Ping(); err != nil {
		return nil, fmt.Errorf("ping server (no DB): %w", err)
	}

	// créer/paramétrer la BDD
	if _, err := serverDB.Exec(
		fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s` DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci", dbName),
	); err != nil {
		return nil, fmt.Errorf("create database %s: %w", dbName, err)
	}
	_, _ = serverDB.Exec(
		fmt.Sprintf("ALTER DATABASE `%s` CHARACTER SET = utf8 COLLATE = utf8_general_ci", dbName),
	)

	// connexion sur la BDD
	cfg.DBName = dbName
	db, err := sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		return nil, fmt.Errorf("connect db %s: %w", dbName, err)
	}
	if err := db.Ping(); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("ping db %s: %w", dbName, err)
	}
	return db, nil
}

func Migrate(db *sql.DB) error {
	users := `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;`

	horses := `
CREATE TABLE IF NOT EXISTS horses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  race VARCHAR(255) NOT NULL,
  fk_user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_horses_user
    FOREIGN KEY (fk_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;`

	weights := `
CREATE TABLE IF NOT EXISTS weights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  weight INT NOT NULL,
  fk_horse_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_weights_horse
    FOREIGN KEY (fk_horse_id) REFERENCES horses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;`

	if _, err := db.Exec(users); err != nil {
		return fmt.Errorf("create users: %w", err)
	}
	if _, err := db.Exec(horses); err != nil {
		return fmt.Errorf("create horses: %w", err)
	}
	if _, err := db.Exec(weights); err != nil {
		return fmt.Errorf("create weights: %w", err)
	}
	return nil
}