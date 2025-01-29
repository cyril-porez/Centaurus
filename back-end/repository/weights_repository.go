package repository

import (
	"back-end-go/model"
	"database/sql"
	"strconv"
	"time"
)

func AddWeightHorse(db *sql.DB, weight *model.Weights, id string) error {
	weight.CreatedAt = time.Now().Format(time.RFC3339);
	var errId error;
	weight.FkHorseId, errId = strconv.Atoi(id);
	if errId != nil {
		return errId
	}
	query := "INSERT INTO weights (weight, date, fk_horse_id, created_at) VALUES (?, ?, ?, ?)"
	_, err := db.Exec(query, weight.Weight, weight.Date, weight.FkHorseId, weight.CreatedAt)
	return err
}

func GetLastWeightHorse(db *sql.DB, weight *model.Weights, id string) error {
	query := `
			SELECT 
				t1.weight AS weight,
				t2.weight AS LastWeight,
				t1.weight - t2.weight AS DifferenceWeight,
				t1.date, 
				t1.fk_horse_id 
			FROM weights AS t1
			JOIN weights AS t2 
					ON t1.fk_horse_id = t2.fk_horse_id
					AND t1.date > t2.date
			WHERE t1.fk_horse_id = ?
			ORDER BY t1.date DESC 
			LIMIT 1`;
	err := db.QueryRow(query, id).Scan(
				&weight.Weight,
				&weight.LastWeight,
				&weight.DifferenceWeight, 
				&weight.Date, 
				&weight.FkHorseId,
			);
	return err;
}