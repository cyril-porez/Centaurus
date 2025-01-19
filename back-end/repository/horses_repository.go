package repository

import (
	"back-end-go/model"
	"database/sql"
	"fmt"
	"strconv"
	"time"
)

func InsertHorse (db *sql.DB, horse *model.Horses) error{
	horse.CreatedAt = time.Now().Format(time.RFC3339);
	query := "INSERT INTO horses (name, race, age, fk_user_id, created_at) VALUES (?, ?, ?, ?, ?)";
	_, err := db.Exec(query, horse.Name, horse.Race, horse.Age, horse.FkUserId, horse.CreatedAt);
	return err;
}

func UpdateHorse (db *sql.DB, horse *model.Horses, id string) error {
	horse.UpdatedAt = time.Now().Format(time.RFC3339);
	num, er := strconv.Atoi(id);
	if er != nil {
		fmt.Println("errur : ", er);
	}
	horse.UpdatedAt = time.Now().Format(time.RFC3339);
	query := "UPDATE horses SET name = ?, age = ?, race = ?, updated_at = ?  WHERE id = ?";
	_,err := db.Exec(query, horse.Name, horse.Age, horse.Race, horse.UpdatedAt,num);
	return err;
}

func GetHorse (db *sql.DB, horse *model.Horses, id string) error {
	num, er := strconv.Atoi(id);
	if er != nil {
		fmt.Println("errur : ", er);
	}
	query := "SELECT name, age, race FROM horses WHERE id = ?";
	err := db.QueryRow(query, num).Scan(&horse.Name, &horse.Age, &horse.Race);
	return err; 
} 

func GetHorsesByUserId (db *sql.DB, id string) (*sql.Rows,error) {
	num, er := strconv.Atoi(id);
	if er != nil { 
		fmt.Println("errur : ", er)
	}

	query := "SELECT id, name, age, race FROM horses WHERE fk_user_id = ?";
	rows, err := db.Query(query, num);
	if err != nil {
		return nil, fmt.Errorf("erreur lors de l'exécution de la requête : %w", err)
	}

	return rows, nil; 
}