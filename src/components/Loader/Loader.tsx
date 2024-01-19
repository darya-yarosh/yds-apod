import LoaderIcon from './Loader.svg';

import './Loader.css';

export default function Loader() {
    return <div className="Loader_wrapper">
        <img className="Loader_spin" src={LoaderIcon} alt={"Loader gif."}/>
    </div>
}