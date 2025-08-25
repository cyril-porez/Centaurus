package interfaces

import (
	"back-end-go/model"
	"database/sql"
)

type WeightRepository interface {
	AddWeightHorse(db *sql.DB, weight *model.Weights) error
	GetHorseWeights(db *sql.DB, horseId int, limit string, sort string) (*sql.Rows, error)
	GetLastWeightHorse(db *sql.DB, horseId int, weight *model.Weights, horse *model.Horses) error

}
