export function PriceCard({ title, price, description, minHeight = "16rem" }) {
  const glassCard = {
 backgroundColor: "rgba(255, 255, 255, 0.1)", // transparent white
            backdropFilter: "blur(50px)", // blur effect
            WebkitBackdropFilter: "blur(10px)", // Safari support
            borderRadius: "15px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            padding: "20px",
            fontSize: "1.2rem",
            fontWeight: "300",
            fontFamily: "jetbrains-mono, monospace",
            color: "rgba(255, 255, 255, 1)",
    minHeight, // keeps a nice minimum while allowing growth
  };

  return (
    <div className="card h-100 bg-transparent border-0">
      <div className="card-body d-flex flex-column h-100" style={glassCard}>
        <h5 className="card-title text-center text-white fw-bold">{title}</h5>

        <div className="flex-grow-1 d-flex align-items-center justify-content-center text-center">
          <p className="card-text text-white mb-0">{description}</p>
        </div>

        <div className="mt-auto text-center">
          <h6 className="card-subtitle mb-0 text-white fw-bold" style={{ fontSize: "1.4rem" }}>
            ${price}
          </h6>
        </div>
      </div>
    </div>
  );
}
