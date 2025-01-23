package model

type Weights struct {
	Id        int    `json:"id"`
	Weight    int    `json:"weight" binding:"required"`
	FkHorseId int    `json:"FkHorseId"`
	CreatedAt string `json:"CreatedAt"`
	UpdatedAt string `json:"UpdateddAt"`
}