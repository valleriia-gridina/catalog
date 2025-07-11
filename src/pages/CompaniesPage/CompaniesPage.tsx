import { useState } from "react";

import PageTitle from "components/PageTitle/PageTitle";
import Panel from "components/Panel/Panel";

import { useGetCompaniesQuery } from "services/companiesApi";
import AddCompanyModal from "./partials/AddCompanyModal";

const CompaniesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data: companiesList } = useGetCompaniesQuery();
  console.log({ companiesList });

  const handleAddEditCompany = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <PageTitle
        title={"Companies list"}
        btnText={"Add new company"}
        onBtnClick={handleAddEditCompany}
      />
      <Panel>
        <ul>
          {companiesList?.map((company) => (
            <li key={company.id}>{company.name}</li>
          ))}
        </ul>
      </Panel>
      <AddCompanyModal
        isOpen={isModalOpen}
        onCloseModal={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CompaniesPage;
