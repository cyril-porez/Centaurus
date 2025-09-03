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
	// D'abord r�cup�rer les infos du cheval (toujours pr�sent)
	horseQuery := "SELECT name FROM horses WHERE id = ?"
	err := db.QueryRow(horseQuery, horseId).Scan(&horse.Name)
	if err != nil {
		return fmt.Errorf("horse not found: %w", err)
	}

	// Ensuite r�cup�rer les poids s'ils existent
	weightQuery := `
		SELECT 
			w1.weight,
			COALESCE(w2.weight, 0) AS LastWeight,
			w1.weight - COALESCE(w2.weight, 0) AS DifferenceWeight,
			w1.created_at,
			w2.created_at AS LastDate,
			w1.fk_horse_id
		FROM weights w1
		LEFT JOIN weights w2 ON w2.fk_horse_id = w1.fk_horse_id
			AND w2.created_at = (
				SELECT MAX(w3.created_at)
				FROM weights w3
				WHERE w3.fk_horse_id = w1.fk_horse_id
				AND w3.created_at < w1.created_at
			)
		WHERE w1.fk_horse_id = ?
		ORDER BY w1.created_at DESC
		LIMIT 1`

	var lastDate sql.NullTime
	err = db.QueryRow(weightQuery, horseId).Scan(
		&weight.Weight,
		&weight.LastWeight,
		&weight.DifferenceWeight,
		&weight.CreatedAt,
		&lastDate,
		&weight.FkHorseId,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			// Aucun poids trouv�, retourner des valeurs par d�faut
			weight.Weight = 0
			weight.LastWeight = 0
			weight.DifferenceWeight = 0
			weight.FkHorseId = horseId
			return nil
		}
		return fmt.Errorf("error querying weights: %w", err)
	}

	// G�rer la date NULL
	if lastDate.Valid {
		weight.LastDate = lastDate.Time
	}

	return nil
}
