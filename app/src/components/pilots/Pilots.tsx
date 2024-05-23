import SiteNav from '../siteNav/SiteNav';
import PilotForm from '../pilotForm/PilotForm';

const Pilots: React.FC<unknown> = () => {
  return (
    <div>
      <SiteNav />
      <div>
        <PilotForm />
      </div>
    </div>
  );
};

export default Pilots;
