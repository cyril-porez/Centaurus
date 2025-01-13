package repository

import (
	"back-end-go/model"
	"database/sql"
	"fmt"
	"strconv"
	"time"
)

func InsertHorse (db *sql.DB, horse *model.Horses) error{
	horse.CreatedAt = time.Now().Format(time.RFC3339)
	query := "INSERT INTO horses (name, race, age, fk_user_id, created_at) VALUES (?, ?, ?, ?, ?)"
	_, err := db.Exec(query, horse.Name, horse.Race, horse.Age, horse.FkUserId, horse.CreatedAt)
	return err
}

func UpdateHorse (db *sql.DB, horse *model.Horses, id string) error {
	num, er := strconv.Atoi(id)
	if er != nil {
		fmt.Println("errur : ", er)
	}
	horse.UpdatedAt = time.Now().Format(time.RFC3339)
	query := "UPDATE horses SET name = ?, age = ?, race = ?  WHERE id = ?"
	_,err := db.Exec(query, horse.Name, horse.Age, horse.Race, num)
	return err
}