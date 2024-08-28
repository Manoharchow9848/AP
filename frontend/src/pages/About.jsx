import { motion } from "framer-motion";
import manoharImage from "../assets/manohar.jpg"; 
import vamsiImage from "../assets/vamsi.jpg"; 

export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-3">
      <h1 className="text-4xl font-semibold text-center my-7 mt-44">
        About Leader with a Cader
      </h1>

      <div className="max-w-4xl mx-auto">
        <p className="text-lg font-semibold text-gray-400 text-center mb-10">
          Welcome to Leader with a Cader, your dedicated platform for connecting
          with local political representatives. Our mission is to provide
          comprehensive information about your Member of Legislative Assembly
          (MLA), including details about their district and constituency. We
          also offer tools to help you identify local leaders by mandal and
          village. Our platform facilitates direct communication with your MLA,
          allowing you to raise tickets and address your concerns effectively.
          Additionally, we showcase the social services and initiatives
          undertaken by your MLA. With user-friendly features and up-to-date
          information, Leader with a Cader aims to empower citizens and enhance
          local governance. Explore our website to stay informed, engaged, and
          connected with your representatives.
        </p>
        <p className="text-lg font-semibold text-gray-400 text-center mb-10">
          Our platform facilitates direct and efficient communication with your
          MLA, allowing you to raise concerns, submit tickets, and address
          issues effectively. Additionally, we showcase the various social
          services and community initiatives led by your MLA, helping you
          understand their impact and how you can benefit or get involved.
          Designed with user-friendly features, Leader with a Cader ensures you
          stay informed with up-to-date information and actively engage in
          enhancing local governance. Explore our website to strengthen your
          connection with your representatives, stay engaged with local
          developments, and contribute to the betterment of your community.
        </p>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col gap-20">
        <h1 className="text-4xl font-semibold text-center my-7">Developed By</h1>

        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="md:w-1/2 text-lg  font-semibold text-gray-400">
            <p>
              Vamsi Meka is one of the founders of Leader with a Cader. His
              vision is to create a platform that empowers citizens and enhances
              local governance by connecting them directly with their
              representatives.
            </p>
          </div>
          <motion.img
            src={vamsiImage}
            alt="Vamsi Mekka"
            className="md:w-48 md:h-48 rounded-full object-cover ml-auto"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          />
        </motion.div>

        <motion.div
          className="flex items-center justify-end mb-48"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.img
            src={manoharImage}
            alt="Manohar Chowdary"
            className="md:w-48 md:h-48 rounded-full object-cover mr-auto"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          />
          <div className="md:w-1/2   text-lg font-semibold text-gray-400 text-right">
            <p className="text-left">
              Manohar Chowdary co-founded Leader with a Cader with a passion for
              improving communication between citizens and their MLAs. His goal
              is to ensure that every citizen's voice is heard and addressed
              effectively.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
