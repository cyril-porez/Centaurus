package repository

import (
	"back-end-go/model"
	"database/sql"
	"fmt"
	"time"
)

type SQLHorseRepository struct {}

func (r *SQLHorseRepository) InsertHorse(db *sql.DB, horse *model.Horses) error{
	horse.CreatedAt = time.Now().Format(time.RFC3339);
	query := "INSERT INTO horses (name, race, age, fk_user_id, created_at) VALUES (?, ?, ?, ?, ?)";
	result, err := db.Exec(query, horse.Name, horse.Race, horse.Age, horse.FkUserId, horse.CreatedAt);
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}
	horse.Id = int(id)

	return nil;
}

func (r *SQLHorseRepository) UpdateHorse(db *sql.DB, input *model.HorseUpdateInput, id int) error {
	updatedAt := time.Now().Format(time.RFC3339)
	query := "UPDATE horses SET name = ?, age = ?, race = ?, updated_at = ?  WHERE id = ?";
	_,err := db.Exec(query, input.Name, input.Age, input.Race, updatedAt, id);
	return err;
}

func (r *SQLHorseRepository) GetHorseById(db *sql.DB, id int) (*model.Horses, error) {
	var horse model.Horses
	query := "SELECT id, name, age, race, fk_user_id, created_at, updated_at FROM horses WHERE id = ?";
	err := db.QueryRow(query, id).Scan(
		&horse.Id,
		&horse.Name, 
		&horse.Age, 
		&horse.Race,
		&horse.FkUserId,
		&horse.CreatedAt,
		&horse.UpdatedAt,
	);
	if err != nil {
		return nil, err
	}
	return &horse, nil 
} 

func (r *SQLHorseRepository) GetHorsesByUserId(db *sql.DB, userId int) ([]model.Horses, error) {
	const q = "SELECT id, name, age, race, fk_user_id, created_at FROM horses WHERE fk_user_id=?"
    rows, err := db.Query(q, userId)
    if err != nil { return nil, err }
    defer rows.Close()

    var list []model.Horses
    for rows.Next() {
        var h model.Horses
        if err := rows.Scan(&h.Id, &h.Name, &h.Age, &h.Race, &h.FkUserId, &h.CreatedAt); err != nil {
            return nil, err
        }
        list = append(list, h)
    }
    if err := rows.Err(); err != nil { return nil, err }
    return list, nil 
}

func (r *SQLHorseRepository) DeleteHorse(db *sql.DB, id int) error {
	query := "DELETE FROM `horses` WHERE id = ?"

	result, err := db.Exec(query, id);
	if err != nil {
		return fmt.Errorf("error executing delete query: : %w", err);
	}

	rowsAffected, err := result.RowsAffected();
	if err != nil {
		return fmt.Errorf("error retrieving affected rows: %w", err)
	}


	if rowsAffected == 0 {
		return fmt.Errorf("no horse found with id %d", id);
	}
	return nil;
}