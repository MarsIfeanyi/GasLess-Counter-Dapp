import React from "react";

import { useState } from "react";
import { ethers } from "ethers";
import abi from "../utils/abi.json";
import {
  IHybridPaymaster,
  SponsorUserOperationDto,
  PaymasterMode,
} from "@biconomy/paymaster";
import { BiconomySmartAccountV2 } from "@biconomy/account";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CONTRACT_ADDRESS } from "@/utils/address";

//type Props = {};

interface Props {
  smartAccount: BiconomySmartAccountV2;
  address: string;
  provider: ethers.providers.Provider;
}

const counterAddress = CONTRACT_ADDRESS;

const SetNumber = ({ smartAccount, address, provider }: Props) => {
  const [number, setNumber] = useState<number>();

  const handleSetNumber = async (e: any) => {
    e.preventDefault();

    const contract = new ethers.Contract(counterAddress, abi, provider);
    try {
      toast.info("Setting your Number...", {
        position: "top-right",
        autoClose: 15000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      const setNumberTx = await contract.populateTransaction.setNumber(number);
      console.log(setNumberTx.data);
      const tx1 = {
        to: counterAddress,
        data: setNumberTx.data,
      };

      console.log("here before userop");
      let userOp = await smartAccount.buildUserOp([tx1]);
      console.log({ userOp });
      const biconomyPaymaster =
        smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;

      let paymasterServiceData: SponsorUserOperationDto = {
        mode: PaymasterMode.SPONSORED,
        smartAccountInfo: {
          name: "BICONOMY",
          version: "2.0.0",
        },
      };
      const paymasterAndDataResponse =
        await biconomyPaymaster.getPaymasterAndData(
          userOp,
          paymasterServiceData
        );

      userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
      const userOpResponse = await smartAccount.sendUserOp(userOp);
      console.log("userOpHash", userOpResponse);
      const { receipt } = await userOpResponse.wait(1);
      console.log("txHash", receipt.transactionHash);
      //setNumber();

      alert(await contract.showAddress());
      toast.success(
        `Success! Here is your transaction:${receipt.transactionHash} `,
        {
          position: "top-right",
          autoClose: 18000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
    } catch (err: any) {
      console.error(err);
      console.log(err);
    }
  };

  return (
    <>
      <form action="" className="flex justify-center">
        <div className="flex">
          <label htmlFor="inputNumber">Number</label>
          <input
            value={number}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNumber(Number(e.target.value))
            }
            type="number"
            name="inputNumber"
            id="inputNumber"
            required
            className="w-[100px] outline-0 py-2 px-1 rounded-lg mt-2 border border-blue-400"
          />
        </div>

        {address && (
          <button
            onClick={handleSetNumber}
            className="text-white bg-blue-900 px-3  rounded-lg"
          >
            Set Number
          </button>
        )}
      </form>

      {number}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default SetNumber;
