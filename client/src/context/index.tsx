import React, { useContext, createContext } from 'react';
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { SmartContract } from '@thirdweb-dev/sdk';

type Form = {
  title: string;
  description: string;
  target: ethers.BigNumber;
  deadline: string | number | Date;
  image: string;
};

type Campaign = {
  owner: string;
  title: string;
  description: string;
  target: ethers.BigNumber;
  deadline: ethers.BigNumber;
  amountCollected: ethers.BigNumber;
  image: string;
};

interface StateContextProps {
  address: string | undefined;
  contract: SmartContract<ethers.BaseContract> | undefined;
  connect: any;
  createCampaign: (form: Form) => Promise<void>;
  getCampaigns: Function;
  getUserCampaigns: Function;
  donate: Function;
  getDonations: Function;
}

const StateContext = createContext<StateContextProps>({} as StateContextProps);

interface Props {
  children: JSX.Element;
}

export const StateContextProvider = ({ children }: Props) => {
  const { contract } = useContract(
    '0x5565fbB604364B666dc703A0cBE63182F7a79B52'
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    'createCampaign'
  );

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form: Form) => {
    try {
      const data = await createCampaign([
        address, // owner
        form.title, // title
        form.description, // description
        form.target, // target
        new Date(form.deadline).getTime(), // deadline
        form.image,
      ]);

      console.log('contract call success', data);
    } catch (error) {
      console.log('contract call failure', error);
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract?.call('getCampaigns');

    const parsedCampaigns = campaigns.map((campaign: Campaign, i: number) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      image: campaign.image,
      pId: i,
    }));

    return parsedCampaigns;
  };

  const getUserCampaigns = async () => {
    const allCampains = await getCampaigns();

    const filteredCampaigns = allCampains.filter(
      (campaign: Campaign) => campaign.owner === address
    );
    return filteredCampaigns;
  };

  const donate = async (pId: number, amount: string) => {
    const data = await contract?.call('donateToCampaign', pId, {
      value: ethers.utils.parseEther(amount),
    });

    return data;
  };

  const getDonations = async (pId: number) => {
    const donations = await contract?.call('getDonators', pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
