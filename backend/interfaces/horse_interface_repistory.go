package interfaces

import (
	"back-end-go/model"
	"database/sql"
)

type HorseRepository interface {
	InsertHorse(db *sql.DB, horse *model.Horses) error
	DeleteHorse(db *sql.DB, id int) error
	UpdateHorse(db *sql.DB, input *model.HorseUpdateInput, id int) error
	GetHorseById(db *sql.DB, id int) (*model.Horses, error)
	GetHorsesByUserId(db *sql.DB, userId int) ([]model.Horses,error)
}