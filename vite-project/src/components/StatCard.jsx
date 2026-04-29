function StatCard({ value, label }) {
    return (
        <div style={{borderRadius:"12px", padding:"20px", textAlign:"center"}}>
            <h2 style={{fontWeight:"bold"}}>{value}</h2>
            <p>{label}</p>
        </div>
    )
}
export default StatCard;