import { PriceCard } from "./components/PriceCard";
import { Link } from "react-router-dom";

export default function Plans() {
  

  return (
    <div className="container py-4">
      <h1 className="text-center text-white">Membership Information</h1>

      <p className="text-white mt-4">
        Take your fitness to the next level with a program designed just for you! Every plan
        includes detailed body measurements and fitness assessments tailored to your goals,
        flexible scheduling, and personalized nutrition coaching—including calories, macros,
        and meal suggestions. Stay connected with 24/7 trainer support via text, track your
        progress with bi-weekly weigh-ins, and access workouts and instructional videos
        anytime through your personal training app. Plus, get expert supplement guidance.
      </p>

      <hr className="border-white opacity-100" />

      {/* ===== 30 Minute Plans ===== */}
      <h2 className="text-center text-white mt-4 mb-3">30 Minute Plans</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div className="col">
          <PriceCard
            title="Kickstart"
            price="180"
            description={
              <>
                One personalized 30-minute session per week—perfect for staying consistent and on track.
                <span className="d-block mt-2 ">4 total sessions</span>
              </>
            }
          />
        </div>
        <div className="col">
          <PriceCard
            title="Balance"
            price="360"
            description={
              <>
                Two personalized 30-minute sessions per week—ideal for steady progress and motivation.
                <span className="d-block mt-2 ">8 total sessions</span>
              </>
            }
          />
        </div>
        <div className="col">
          <PriceCard
            title="Lifestyle"
            price="540"
            description={
              <>
                Three personalized 30-minute sessions per week—maximize results with consistent guidance.
                <span className="d-block mt-2 ">12 total sessions</span>
              </>
            }
          />
        </div>
      </div>

      <hr className="border-white opacity-100 my-5" />

      {/* ===== 1 Hour Plans ===== */}
      <h2 className="text-center text-white mt-4 mb-3">1 Hour Plans</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div className="col">
          <PriceCard
            title="Kickstart Plus"
            price="240"
            description={
              <>
                One personalized 1-hour session per week—a full, focused workout to maximize your results.
                <span className="d-block mt-2 ">4 total sessions</span>
              </>
            }
          />
        </div>
        <div className="col">
          <PriceCard
            title="Balance Plus"
            price="480"
            description={
              <>
                Two personalized 1-hour sessions per week—double the guidance for faster, consistent progress.
                <span className="d-block mt-2 ">8 total sessions</span>
              </>
            }
          />
        </div>
        <div className="col">
          <PriceCard
            title="Lifestyle Plus"
            price="720"
            description={
              <>
                Three personalized 1-hour sessions per week—intensive coaching to reach your goals efficiently.
                <span className="d-block mt-2 ">12 total sessions</span>
              </>
            }
          />
        </div>
      </div>

      <hr className="border-white opacity-100 mt-5" />

      <div className="text-center">
        <Link
          to="/contact"
          className="btn btn-primary mt-3 mb-3 rounded-button"
          style={{ width: 300 }}
        >
          Click For More Information
        </Link>
      </div>
    </div>
  );
}
