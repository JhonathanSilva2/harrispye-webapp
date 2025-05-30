export const AutoBudgetInitialRowState = {
	piping: {
		id: "",
		spec: "",
		diameter: "",
		ncm: "",
		pricePerKg: 0,
		weight: 0,
		basePrice: 0,
		salesPrice: 0,
	},
	looseMaterial: {
		id: "",
		spec: "",
		diameter: "",
		ncm: "",
		pricePerJoint: 0,
		numJoints: 0,
		basePrice: 0,
		salesPrice: 0,
	},
	manual: {
		id: "",
		quantity: 1,
		partDescription: "",
		ncm: "",
		pricePerKg: 0,
		weight: 0,
		basePrice: 0,
		salesPrice: 0,
	},
	service: {
		id: "",
		quantity: 1,
		description: "",
		serviceType: "",
		calcType: "",
		dailyBasePrice: 0,
		dailySalesPrice: 0,
		days: 1,
		unitDailyPrice: 0,
		basePrice: 0,
		salesPrice: 0,
	},
};

export const AutobudgetContants = {
	DEFAULT_MARGIN_RATE: 25,
};
