function DashboardCard({ title, value, color }) {
  return (
    <div className="col-lg-3 col-md-6">
      <div className={`card border-0 shadow bg-${color} text-white h-100`}>
        <div className="card-body text-center">

          <h5 className="fw-bold">
            {title}
          </h5>

          <h1 className="display-5 fw-bold mt-3">
            {value}
          </h1>

        </div>
      </div>
    </div>
  );
}

export default DashboardCard;