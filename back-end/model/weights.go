package model

import "time"

type Weights struct {
	Id        int				`json:"id"`
	Weight    int				`json:"weight" binding:"required"`
	Date      time.Time `json:"date" binding:"required"`
	FkHorseId int				`json:"FkHorseId"`
	CreatedAt string		`json:"CreatedAt"`
	UpdatedAt string		`json:"UpdateddAt"`
}