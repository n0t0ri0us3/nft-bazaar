import React from "react";
import './App.css';

function Home() {
  return (
    <body>
        <div className="container align-items-center">
          <div className="row align-items-center my-5">
            <div className="col-lg-7">
              <img alt="Featured" class="shadow_image" style={{borderRadius:'20px'}} src="https://lh3.googleusercontent.com/aXIeaukiZBG1OlIqkfo5j1Z63P060AlM2Qko9eIaN4s8UXPBDAGfErwSh4KrCAec6K23l8KOJQWeEcEmEOU5FFWAuO-Dg50wQlY4TCI=s550"/>
            </div>
            <div className="col-lg-5" style={{color:'black'}}>
              <h1 className="font-weight-light">Ana Sayfa</h1>
              <p>
                    NFT Bazaar Türkiye'nin ilk NFT alım-satım platformudur
              </p>
            </div>
          </div>
        </div>
    </body>
  );
}

export default Home;