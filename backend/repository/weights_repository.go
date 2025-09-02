package repository

import (
	"back-end-go/model"
	"database/sql"
	"fmt"
	"strconv"
)

type SQLWeightRepository struct {}

func (r *SQLWeightRepository) AddWeightHorse(db *sql.DB, weight *model.Weights) error {	
	query := "INSERT INTO weights (weight, fk_horse_id) VALUES (?, ?)"
	_, err := db.Exec(query, weight.Weight, weight.FkHorseId)
	return err
}

func (r *SQLWeightRepository) GetHorseWeights(db *sql.DB, horseId int, limit string, sort string) (*sql.Rows, error) {
	baseQuery := `
		SELECT 
			h.name, 
			w.created_at, 
			w.weight,
			w.fk_horse_id
		FROM horses AS h
			INNER JOIN weights AS w ON h.id = w.fk_horse_id
		WHERE h.id = ?
	`

	if sort == "desc" {
		baseQuery += " ORDER BY w.created_at DESC"
	} else {
		baseQuery += " ORDER BY w.created_at ASC"
	}

	if limit != "" {
		if _, err := strconv.Atoi(limit); err != nil {
			return nil, fmt.Errorf("invalid limit parameter")
		}
		baseQuery += " LIMIT " + limit
	}

	rows, err := db.Query(baseQuery, horseId)
	return rows, err
}

func (r *SQLWeightRepository) GetLastWeightHorse(db *sql.DB, horseId int, weight *model.Weights, horse *model.Horses) error {
	query := `
			SELECT 
				h.name,
				w1.weight AS weight,
				w2.weight AS LastWeight,
				w1.weight - w2.weight AS DifferenceWeight,
				w1.created_at AS date,
				w2.created_at AS LastDate,
				w1.fk_horse_id
			FROM horses AS h
			INNER JOIN weights AS w1 ON h.id = w1.fk_horse_id
			LEFT JOIN weights AS w2 ON w2.fk_horse_id = w1.fk_horse_id 
				AND w2.created_at = (
					SELECT MAX(w3.created_at)
					FROM weights AS w3
					WHERE w3.fk_horse_id = w1.fk_horse_id
						AND w3.created_at < w1.created_at
				)
			WHERE h.id = ?
			ORDER BY w1.created_at DESC 
			LIMIT 1`;

	err := db.QueryRow(query, horseId).Scan(
				&horse.Name,
				&weight.Weight,
				&weight.LastWeight,
				&weight.DifferenceWeight, 
				&weight.CreatedAt, 
				&weight.LastDate,
				&weight.FkHorseId,
			);
	return err;
}
