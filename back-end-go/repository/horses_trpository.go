package repository

import (
	"back-end-go/model"
	"database/sql"
)

func InserHorse (db *sql.DB, horse model.Horses) error{
	fkUserId := 34
	query := "INSER INTO horses (username, race, fk_user_id, created_at) VALUES (?, ?, ?, ?)"
	_, err := db.Exec(query, horse.Name, horse.Race, fkUserId, horse.CreatedAt)
	return err
}