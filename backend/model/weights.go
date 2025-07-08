package model

type Weights struct {
	Id               int    `json:"id"`
	Weight           int    `json:"weight" binding:"required"`
	LastWeight       int    `json:"lastWeight"`
	DifferenceWeight int    `json:"diiferenceWeight"`
	LastDate         string `json:"last_date"`
	FkHorseId        int    `json:"FkHorseId"`
	CreatedAt        string `json:"CreatedAt"`
	UpdatedAt        string `json:"UpdateddAt"`
}