import Head from "next/head";

import { ParticleAuthModule, ParticleProvider } from "@biconomy/particle-auth";

import { useState } from "react";
import { IBundler, Bundler } from "@biconomy/bundler";
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import { ethers } from "ethers";
import { ChainId } from "@biconomy/core-types";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules";

import IncrementNumber from "@/components/IncrementNumber";
import DecrementNumber from "@/components/DecrementNumber";
import SetNumber from "@/components/SetNumber";
import ShowAddress from "@/components/ShowAddress";

export default function Home() {
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [smartAccount, setSmartAccount] =
    useState<BiconomySmartAccountV2 | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Provider | null>(
    null
  );

  const connect = async () => {
    try {
      setLoading(true);
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);

      const module = await ECDSAOwnershipValidationModule.create({
        signer: web3Provider.getSigner(),
        moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
      });

      let biconomySmartAccount = await BiconomySmartAccountV2.create({
        chainId: ChainId.POLYGON_MUMBAI,
        bundler: bundler,
        paymaster: paymaster,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        defaultValidationModule: module,
        activeValidationModule: module,
      });
      setAddress(await biconomySmartAccount.getAccountAddress());
      setSmartAccount(biconomySmartAccount);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const bundler: IBundler = new Bundler({
    bundlerUrl: `https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,
    chainId: ChainId.POLYGON_MUMBAI,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  });

  const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl:
      "https://paymaster.biconomy.io/api/v1/80001/hKClB2hS4.e6d7f3b6-ef31-4368-9f5a-29ba55ef40f7",
  });

  return (
    <>
      <Head>
        <title>Based Account Abstraction</title>
        <meta name="description" content="Based Account Abstraction" />
      </Head>
      <main className="text-center font-medium">
        <main className="">
          <nav className="flex justify-between  text-blue-900 mx-24 mt-10 ">
            <h1 className="font-extrabold text-3xl">
              Counter Gasless Transactions
            </h1>

            {!loading && !address && (
              <button
                onClick={connect}
                className="text-xl text-white bg-blue-900 px-4 rounded-lg "
              >
                Connect
              </button>
            )}
          </nav>

          {loading && <p className="text-blue-600">Loading Smart Account...</p>}

          <div className="mt-16">
            {smartAccount && provider && (
              <SetNumber
                smartAccount={smartAccount}
                address={address}
                provider={provider}
              />
            )}
          </div>

          <div className="flex flex-row  justify-center gap-10 mt-10 ">
            {smartAccount && provider && (
              <IncrementNumber
                smartAccount={smartAccount}
                address={address}
                provider={provider}
              />
            )}

            {smartAccount && provider && (
              <DecrementNumber
                smartAccount={smartAccount}
                address={address}
                provider={provider}
              />
            )}
          </div>

          <div className="mt-10">
            {smartAccount && provider && (
              <ShowAddress
                smartAccount={smartAccount}
                address={address}
                provider={provider}
              />
            )}
          </div>
          {/* {smartAccount && provider && (
            <GetNumber
              smartAccount={smartAccount}
              address={address}
              provider={provider}
            />
          )} */}
        </main>
      </main>
    </>
  );
}
