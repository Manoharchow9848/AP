import React from "react";

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div>
          <h1 className="text-3xl font font-semibold text-center my-7">
            MLA Locator: District & Mandal Search for Andhra Pradesh
          </h1>
          <div className="text-md text-gray-500 flex flex-col gap-6">
            <p>
              Welcome to the MLA Locator, your go-to tool for quickly and easily
              finding your elected representative in Andhra Pradesh. Whether
              you're looking to connect with your MLA for assistance,
              information, or support, our platform allows you to search based
              on your specific district and mandal. This ensures that you get
              accurate, up-to-date information tailored to your location. With
              an intuitive interface and comprehensive database, finding your
              MLA has never been easier. Empower yourself with the knowledge of
              your local leadership and stay connected with the representatives
              who serve your community.
            </p>

            <p>
              Our MLA Locator is designed with the people of Andhra Pradesh in
              mind, making it simple to navigate through the complex political
              landscape of the state. By entering your district and mandal, you
              can instantly access the details of the MLA responsible for your
              area, including their contact information and office location.
              Whether you're addressing local issues, seeking government
              services, or staying informed about your constituency, this tool
              is an invaluable resource for every citizen. Stay engaged and make
              your voice heard by connecting with your elected officials with
              ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
