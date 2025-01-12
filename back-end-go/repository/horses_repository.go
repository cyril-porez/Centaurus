package repository

import (
	"back-end-go/model"
	"database/sql"
	"time"
)

func InsertHorse (db *sql.DB, horse *model.Horses) error{
	horse.CreatedAt = time.Now().Format(time.RFC3339)
	query := "INSERT INTO horses (name, race, age, fk_user_id, created_at) VALUES (?, ?, ?, ?, ?)"
	_, err := db.Exec(query, horse.Name, horse.Race, horse.Age, horse.FkUserId, horse.CreatedAt)
	return err
}