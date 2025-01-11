package repository

import (
	"back-end-go/model"
	"database/sql"
)

func InsertHorse (db *sql.DB, horse *model.Horses) error{
	query := "INSERT INTO horses (name, race, age, fk_user_id, created_at) VALUES (?, ?, ?, ?, ?)"
	_, err := db.Exec(query, horse.Name, horse.Race, horse.Age, horse.FkUserId, horse.CreatedAt)
	return err
}