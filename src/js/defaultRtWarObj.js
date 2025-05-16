export const InitQuery = {
	brand: "",
	creator: "",
	cur_config: "",
	decision: "",
	is_fraud: false,
	is_junk: false,
	is_need_war: false,
	lb_type: "",
	model: "",
	order_id: "",
	rt_dt: "",
	rec_dt: "",
	rt_cmt: "",
	rt_cmt_cs: "",
	rt_qty: "1",
	rt_reason: "",
	rt_track: "",
	seller: "",
	sn: "",
	upc: "",
	war_case: "",
	war_cmt: "",
	war_method: "",
	war_opr: "",
	war_track_in: "",
	war_track_out: "",
	war_def: "",
	pic_ids: [],
	rt_region:1
}

export const DecisionOption = [
	"Sell as new", "Used: Good", "Repair needed", "Junk for parts", "Pending Decision"
]

export const BrandOption = [
	"HP", "LENOVO", "DELL", "ACER", "ASUS", "MSI", "LG", "SAMSUNG", "INTEL"
]

export const SellerOption = [
	"ROC","ONT", "COU", "VNE", "IVY", "RTC", "HLT", "ROB", "DAS", "ETS", "KLT", "GFA", "WWC", "CHILL_AU"
]

export const DefectsOption = [
	"No Power",
	"Power On, No display",
	"Random BSOD",
	"Display Artifacts",
	"Broken Display",
	"Water damage",
	"Physical damage",
	"Others"
]