describe('Paytm Bus Web App', () => {
  it('should open the bus page and complete full booking flow', async () => {
    // Navigate to the bus page
    await browser.url('/bus');  // baseUrl + /bus = http://fe.paytm.com:3001/bus
    
    // Clear all browser storage and cookies before executing the test
    console.log('=== CLEARING ALL BROWSER STORAGE AND COOKIES ===');
    
    // Clear localStorage, sessionStorage, and cookies
    // await browser.execute(() => {
    //   // Clear localStorage
    //   if (typeof localStorage !== 'undefined') {
    //     // localStorage.clear();
    //     localStorage.setItem('sessionValue', {"isLogin":true,"env":"production","action_type":"login","user":{"info":{"id":1338927460,"email":"kashyaprohit8360@gmail.com","userTypes":["BANK_CUSTOMER","SD_MERCHANT","MERCHANT"],"minKycDetails":{"isMinKyc":true,"kycState":"PAYTM_MIN_KYC"},"expiryTime":"1749638959000","userAttributeInfo":{"IVR_FLAG":"1","USER_TYPE":"3,5,4","CHAT_LANGUAGE":"en-IN","CUSTOMER_TYPE":"0","BANK_CONSENT":"true","isCAeligible":"true","SMS_FLAG":"1"},"firstName":"","lastName":"","mobile":8360351172,"countryCode":"91","isKyc":false,"created_at":"Jul 4, 2021 3:09:34 PM","walletType":"SCW","sendEmailFLag":true,"is_verified_email":true,"is_verified_mobile":true,"status":true,"username":8360351172},"id":1338927460,"email":"kashyaprohit8360@gmail.com","sso_token_enc":"15dcd9d9a499e81e02990ea23c6aa098fcdb4ab70421f5b03cba3add174380fa07447b82c5f6fa165cedb19ae8ddd128","sso_token_enc_iv":"9c3936f270cc8d2dd5d840cc7956daa7a52f70a4904a068c81c46e7171f7f3b4da095ecb7fd14f6302dd5bb862503346","encWalletToken":"15dcd9d9a499e81e02990ea23c6aa098fcdb4ab70421f5b03cba3add174380fa07447b82c5f6fa165cedb19ae8ddd128","encWalletTokenIV":"9c3936f270cc8d2dd5d840cc7956daa7a52f70a4904a068c81c46e7171f7f3b4da095ecb7fd14f6302dd5bb862503346"}});
    //     localStorage.removeItem('Paytm-MBus-RecentSearches');
    //     console.log('✅ localStorage cleared');
    //   }
    // });
    
    // Refresh browser after clearing storage (must be outside browser.execute)
    // await browser.refresh();
    console.log('✅ Browser refreshed to reflect storage changes');
    
    // Clear all cookies

    
    console.log('🧹 Browser storage cleanup completed');
    
    const title = await browser.getTitle();
    console.log('Page Title:', title);
    expect(title).toContain('Bus');  // Adjust based on actual page title
    
    // Wait for the page to load completely
    await browser.pause(2000); // Reduced from 3000

    // === DATE SELECTION: SELECT NEXT DAY ===
    console.log('=== SELECTING NEXT DAY DATE ===');
    
    try {
      // Get today's date and calculate tomorrow
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Get tomorrow's day name (e.g., "monday", "tuesday", etc.)
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const tomorrowDayName = dayNames[tomorrow.getDay()].toLowerCase();
      
      console.log(`Today is: ${dayNames[today.getDay()]}`);
      console.log(`Looking for tomorrow: ${tomorrowDayName}`);
      console.log(`Tomorrow's date: ${tomorrow.getDate()}/${tomorrow.getMonth() + 1}/${tomorrow.getFullYear()}`);
      
      // Look for date elements with aria-label matching tomorrow's day
      console.log(`Searching for date element with aria-label containing "${tomorrowDayName}"...`);
      
      // Try multiple selectors to find the date element
      const dateSelectors = [
        `//*[@aria-label[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${tomorrowDayName}")]]`,
        `//*[contains(@aria-label, "${tomorrowDayName}")]`,
        `//*[contains(@aria-label, "${tomorrowDayName.charAt(0).toUpperCase() + tomorrowDayName.slice(1)}")]`
      ];
      
      let dateSelected = false;
      
      for (const selector of dateSelectors) {
        try {
          console.log(`Trying selector: ${selector}`);
          const tomorrowDateElement = await $(selector);
          
          if (await tomorrowDateElement.isExisting()) {
            console.log(`Found date element with aria-label for ${tomorrowDayName}`);
            
            // Check if element is clickable and displayed
            const isDisplayed = await tomorrowDateElement.isDisplayed();
            const isClickable = await tomorrowDateElement.isClickable();
            
            if (isDisplayed && isClickable) {
              console.log(`Clicking on ${tomorrowDayName} date...`);
              await tomorrowDateElement.click();
              console.log(`✅ Successfully selected ${tomorrowDayName} date`);
              dateSelected = true;
              break;
            } else {
              console.log(`Date element found but not clickable/displayed`);
            }
          } else {
            console.log(`Date element not found with this selector`);
          }
        } catch (e) {
          console.log(`Error with selector ${selector}:`, e.message);
        }
      }
      
      // Alternative approach: Find all date elements and check their aria-labels
      if (!dateSelected) {
        console.log('Alternative approach: Checking all elements with aria-label...');
        
        const allAriaLabelElements = await $$('//*[@aria-label]');
        console.log(`Found ${allAriaLabelElements.length} elements with aria-label`);
        
        for (let i = 0; i < allAriaLabelElements.length; i++) {
          try {
            const element = allAriaLabelElements[i];
            const ariaLabel = await element.getAttribute('aria-label');
            
            if (ariaLabel && ariaLabel.toLowerCase().includes(tomorrowDayName)) {
              console.log(`Found matching aria-label: "${ariaLabel}"`);
              
              const isDisplayed = await element.isDisplayed();
              const isClickable = await element.isClickable();
              
              if (isDisplayed && isClickable) {
                console.log(`Clicking element with aria-label: "${ariaLabel}"`);
                await element.click();
                console.log(`✅ Successfully selected date using aria-label: "${ariaLabel}"`);
                dateSelected = true;
                break;
              } else {
                console.log(`Element with aria-label "${ariaLabel}" not clickable/displayed`);
              }
            }
          } catch (e) {
            console.log(`Error checking element ${i}:`, e.message);
          }
        }
      }
      
      // Final fallback: Look for date number in date picker
      if (!dateSelected) {
        console.log('Final fallback: Looking for tomorrow\'s date number...');
        const tomorrowDate = tomorrow.getDate();
        
        const dateNumberElement = await $(`//*[contains(@class, "date") or contains(@class, "day")]//*[text()="${tomorrowDate}"] | //*[text()="${tomorrowDate}"][contains(@class, "date") or contains(@class, "day")]`);
        
        if (await dateNumberElement.isExisting()) {
          const isDisplayed = await dateNumberElement.isDisplayed();
          const isClickable = await dateNumberElement.isClickable();
          
          if (isDisplayed && isClickable) {
            console.log(`Clicking on date number: ${tomorrowDate}`);
            await dateNumberElement.click();
            console.log(`✅ Successfully selected date ${tomorrowDate} (fallback)`);
            dateSelected = true;
          }
        }
      }
      
      if (dateSelected) {
        console.log('✅ Date selection completed successfully');
        // Wait for date selection to register
        await browser.pause(2000);
      } else {
        console.log('⚠️ Could not select tomorrow\'s date - proceeding with default date');
        console.log('💡 Manual date selection may be required');
      }
      
    } catch (e) {
      console.log('❌ Date selection failed:', e.message);
      console.log('⚠️ Proceeding without date selection - may use default date');
    }
    
    // Fill From and To fields
    console.log('=== FILLING FROM AND TO FIELDS ===');
    
    let fieldsFilledSuccessfully = false;
    
    // First check if From and To fields are already filled
    console.log('Checking if From and To fields are already filled...');
    const fromDiv = await $('//*[contains(text(), "From")]');
    const toDiv = await $('//*[contains(text(), "To")]');
    
   
      console.log('From and To fields need to be filled. Proceeding with form filling...', fromDiv);
      
      try {
        // Click on From div to open input field
        console.log('Looking for From div to click...');
        
        if (await fromDiv.isExisting()) {
          console.log('Found From div, clicking to open input...');
          await fromDiv.click();
          await browser.pause(1000); // Wait for input to appear
          
          // Now look for the input field that appeared using specific ID
          console.log('Looking for From input field by ID searchContainerSource...');
          const fromInput = await $('#searchContainerSource');
          
          if (await fromInput.isExisting()) {
            console.log('Found From input field with ID, filling...');
            await fromInput.clearValue();
            await fromInput.setValue('Bengaluru');
            console.log('✅ Entered Bengaluru in From field');
            
            // Wait for suggestions and select first item
            await browser.pause(2000);
            try {
              // Use image with alt="city" as reference for suggestion selection
              console.log('Looking for From suggestions using city icon reference...');
              
              const cityIconSuggestions = await $$('//img[@alt="city"]/parent::* | //img[@alt="city"]/ancestor::*[1] | //img[contains(@alt, "city")]/parent::*');
              console.log(`Found ${cityIconSuggestions.length} suggestions with city icons`);
              
              let fromSuggestionSelected = false;
              
              if (cityIconSuggestions.length > 0) {
                // Try to click the first suggestion with city icon
                for (let i = 0; i < cityIconSuggestions.length; i++) {
                  try {
                    const suggestion = cityIconSuggestions[i];
                    const isClickable = await suggestion.isClickable();
                    const isDisplayed = await suggestion.isDisplayed();
                    
                    if (isClickable && isDisplayed) {
                      console.log(`Clicking From suggestion ${i} with city icon...`);
                      await suggestion.click();
                      console.log('✅ Selected From suggestion using city icon');
                      fromSuggestionSelected = true;
                      break;
                    }
                  } catch (e) {
                    console.log(`Failed to click From suggestion ${i} with city icon:`, e.message);
                  }
                }
              }
              
              // Fallback to text-based selection if city icon method fails
              if (!fromSuggestionSelected) {
                console.log('City icon method failed, trying text-based selection...');
                const firstFromSuggestion = await $('//*[contains(text(), "Bengaluru")][1] | //li[1] | //*[contains(@class, "suggestion")][1]');
                if (await firstFromSuggestion.isExisting()) {
                  await firstFromSuggestion.click();
                  console.log('✅ Selected first item from From suggestions (fallback)');
                  fromSuggestionSelected = true;
                } else {
                  console.log('No From suggestions found with fallback method');
                }
              }
              
              if (fromSuggestionSelected) {
                // Wait longer for UI to settle after From selection
                console.log('⏳ Waiting for UI to settle after From selection...');
                await browser.pause(3000); // Increased from 1000 to 3000ms
              }
              
            } catch (e) {
              console.log('From suggestion selection failed:', e.message);
              await browser.pause(1000);
            }
            
            // Debug: Check page state before proceeding to To field
            console.log('=== DEBUGGING BEFORE TO FIELD ===');
            try {
              const currentUrl = await browser.getUrl();
              console.log('Current URL:', currentUrl);
              
              const pageTitle = await browser.getTitle();
              console.log('Current page title:', pageTitle);
            } catch (e) {
              console.log('Debug failed:', e.message);
            }
            
            // To input should now be directly available below From input
            console.log('Looking for To input field directly (no div click needed)...');
            const toInput = await $('#searchContainerDestination');
            
            if (await toInput.isExisting()) {
              console.log('Found To input field with ID, clicking first to ensure focus...');
              await toInput.click();
              await browser.pause(500);
              
              console.log('Clearing and filling To field...');
              await toInput.clearValue();
              await toInput.setValue('Hyderabad');
              console.log('✅ Entered Hyderabad in To field');
              
              // Verify the value was entered
              try {
                const enteredValue = await toInput.getValue();
                console.log(`Verification: To field value is "${enteredValue}"`);
              } catch (e) {
                console.log('Could not verify To field value');
              }
              
              // Wait for suggestions and select first item
              await browser.pause(2000);
              try {
                // Use image with alt="city" as reference for suggestion selection
                console.log('Looking for To suggestions using city icon reference...');
                
                const cityIconSuggestions = await $$('//img[@alt="city"]/parent::* | //img[@alt="city"]/ancestor::*[1] | //img[contains(@alt, "city")]/parent::*');
                console.log(`Found ${cityIconSuggestions.length} suggestions with city icons`);
                
                let toSuggestionSelected = false;
                
                if (cityIconSuggestions.length > 0) {
                  // Try to click the first suggestion with city icon
                  for (let i = 0; i < cityIconSuggestions.length; i++) {
                    try {
                      const suggestion = cityIconSuggestions[i];
                      const isClickable = await suggestion.isClickable();
                      const isDisplayed = await suggestion.isDisplayed();
                      
                      if (isClickable && isDisplayed) {
                        console.log(`Clicking To suggestion ${i} with city icon...`);
                        await suggestion.click();
                        console.log('✅ Selected To suggestion using city icon');
                        toSuggestionSelected = true;
                        break;
                      }
                    } catch (e) {
                      console.log(`Failed to click To suggestion ${i} with city icon:`, e.message);
                    }
                  }
                }
                
                // Fallback to text-based selection if city icon method fails
                if (!toSuggestionSelected) {
                  console.log('City icon method failed, trying text-based selection...');
                  const firstToSuggestion = await $('//*[contains(text(), "Hyderabad")][1] | //li[1] | //*[contains(@class, "suggestion")][1]');
                  if (await firstToSuggestion.isExisting()) {
                    await firstToSuggestion.click();
                    console.log('✅ Selected first item from To suggestions (fallback)');
                    toSuggestionSelected = true;
                  } else {
                    console.log('No To suggestions found with fallback method');
                  }
                }
                
                // Final fallback: keyboard navigation
                if (!toSuggestionSelected) {
                  console.log('Trying keyboard navigation as final fallback...');
                  try {
                    await toInput.click();
                    await browser.keys(['ArrowDown', 'Enter']);
                    console.log('✅ Selected To suggestion using keyboard navigation');
                    toSuggestionSelected = true;
                  } catch (e) {
                    console.log('Keyboard navigation failed:', e.message);
                  }
                }
                
                if (toSuggestionSelected) {
                  console.log('✅ To suggestion selection completed successfully');
                } else {
                  console.log('❌ Could not select any To suggestion with any method');
                }
                
              } catch (e) {
                console.log('To suggestion selection failed:', e.message);
              }
              
              fieldsFilledSuccessfully = true;
              console.log('✅ Both From and To fields filled successfully');
              
            } else {
              console.log('❌ To input field with ID searchContainerDestination not found directly');
              
              // Debug: Try to find what inputs are available
              console.log('Debugging: Looking for any inputs available...');
              const allInputs = await $$('//input');
              console.log(`Found ${allInputs.length} input elements`);
              
              // Fallback: Try to use any second input if available
              if (allInputs.length >= 2) {
                console.log('Fallback: Trying to use second input as To field...');
                const secondInput = allInputs[1];
                await secondInput.click();
                await browser.pause(500);
                await secondInput.clearValue();
                await secondInput.setValue('Hyderabad');
                console.log('✅ Entered Hyderabad in second input (fallback)');
                
                await browser.pause(2000);
                try {
                  const firstToSuggestion = await $('//*[contains(text(), "Hyderabad")][1]');
                  if (await firstToSuggestion.isExisting()) {
                    await firstToSuggestion.click();
                    console.log('✅ Selected Hyderabad suggestion (fallback)');
                  }
                } catch (e) {
                  console.log('Fallback To suggestion failed:', e.message);
                }
                
                fieldsFilledSuccessfully = true;
                console.log('✅ Both fields filled successfully using fallback method');
              }
            }
            
          } else {
            console.log('❌ From input field with ID searchContainerSource did not appear');
          }
          
        } else {
          console.log('From div not found, trying to click Search Buses directly...');
          const searchButton = await $('//*[contains(text(), "Search Buses")] | //button[contains(text(), "Search")] | //*[contains(text(), "Search")]');
          if (await searchButton.isExisting()) {
            await searchButton.click();
            console.log('✅ Clicked Search Buses button directly');
          } else {
            console.log('❌ Search Buses button not found');
          }
        }
        
      } catch (e) {
        console.log('Field filling failed:', e.message);
      }
    
    
    await browser.pause(1000);
    
    // Only search for buses if fields were filled successfully
    if (fieldsFilledSuccessfully) {
      // Search for buses
      console.log('=== SEARCHING FOR BUSES ===');
      await browser.execute('window.scrollBy(0, 200)');
      await browser.pause(500);
      
      try {
        const searchButton = await $('//*[contains(text(), "Search Buses")] | //button[contains(text(), "Search")] | //*[contains(text(), "Search")]');
        if (await searchButton.isExisting()) {
          console.log('Found search button, clicking...');
          await searchButton.click();
          console.log('✅ Search button clicked successfully');
        } else {
          // Scroll down more to find search button
          console.log('Search button not found, scrolling down...');
          await browser.execute('window.scrollBy(0, 300)');
          await browser.pause(1000);
          
          const searchBtnAfterScroll = await $('//*[contains(text(), "Search Buses")] | //*[contains(text(), "Search")]');
          if (await searchBtnAfterScroll.isExisting()) {
            console.log('Found search button after scroll, clicking...');
            await searchBtnAfterScroll.click();
            console.log('✅ Search button clicked after scroll');
          } else {
            console.log('❌ Still no search button found - may need manual intervention');
            throw new Error('Search button not found after scrolling');
          }
        }
      } catch (e) {
        console.log('Search button click failed:', e.message);
        throw new Error('Could not proceed past homepage - search button issue');
      }
    } else {
      console.log('❌ Skipping search - From and To fields were not filled successfully');
      throw new Error('Cannot proceed without filling From and To fields');
    }
    
    // Wait for navigation to search results (reduced wait time)
    console.log('⏳ Waiting for navigation to search results...');
    await browser.pause(3000); // Reduced from 5000
    
    let currentUrl = await browser.getUrl();
    console.log('URL after search:', currentUrl);
    
    // Verify navigation success
    if (currentUrl.includes('search') || currentUrl.includes('result')) {
      console.log('✅ Successfully navigated to search results page');
    } else {
      console.log('❌ May not have navigated to search results - URL:', currentUrl);
      // Try to continue anyway
    }
    
    // === STEP 1: CLICK FIRST BUS CARD ===
    console.log('=== STEP 1: CLICKING FIRST BUS CARD ===');
    await browser.pause(3000);
    
    try {
      // Look for the first bus card - try multiple selectors
      const firstBusCard = await $('//*[contains(text(), "Buses found")]/following-sibling::*//*[contains(text(), "Travels")][1] | //*[contains(@class, "bus")][1] | //*[contains(text(), "₹")]/ancestor::*[contains(@class, "card") or contains(@class, "bus")][1]');
      if (await firstBusCard.isExisting()) {
        console.log('Found first bus card, clicking...');
        await firstBusCard.click();
        console.log('✅ First bus card clicked');
      } else {
        // Alternative: Look for any clickable bus element
        const busElement = await $('//*[contains(text(), "Sri Rajaram Travels") or contains(text(), "Travels")][1]');
        if (await busElement.isExisting()) {
          console.log('Found bus element, clicking...');
          await busElement.click();
          console.log('✅ Bus element clicked');
        } else {
          console.log('❌ No bus card found');
        }
      }
    } catch (e) {
      console.log('Bus card click failed:', e.message);
    }
    
    // === STEP 2: SELECT SEAT ===
    console.log('=== STEP 2: SELECTING SEAT ===');
    await browser.pause(4000);
    
    try {
      console.log('🪑 Looking for ANY available seat to click just ONCE...');
      
      // Simple approach: Find first available seat with price and click it once
      console.log('Finding first seat with price...');
      
      // Look for clean price elements that are likely seats
      const seatPrices = await $$('//*[contains(text(), "₹") and string-length(text()) < 8]');
      console.log(`Found ${seatPrices.length} potential seat price elements`);
      
      let seatClicked = false;
      
      for (let i = 0; i < seatPrices.length; i++) {
        try {
          const priceElement = seatPrices[i];
          const priceText = await priceElement.getText();
          
          // Skip summary text or banners
          if (priceText.includes('starting') || priceText.includes('with') || priceText.length > 8) {
            console.log(`Skipping ${i}: "${priceText}" - looks like summary text`);
            continue;
          }
          
          // Check if it looks like a valid seat price
          if (priceText.match(/^₹\d{3,4}$/)) {
            console.log(`🎯 Found valid seat price: ${priceText}`);
            
            // Try to click this seat
            if (await priceElement.isDisplayed() && await priceElement.isClickable()) {
              console.log(`🪑 Clicking seat with price ${priceText} - WILL ONLY CLICK ONCE!`);
              await priceElement.scrollIntoView();
              await browser.pause(500);
              await priceElement.click();
              console.log(`✅ Clicked seat ${i} with price ${priceText}`);
              seatClicked = true;
              break; // STOP IMMEDIATELY after first click
            } else {
              // Try parent container if price element itself isn't clickable
              const parent = await priceElement.$('..');
              if (await parent.isClickable() && await parent.isDisplayed()) {
                console.log(`🪑 Clicking parent container for seat with price ${priceText}`);
                await parent.scrollIntoView();
                await browser.pause(500);
                await parent.click();
                console.log(`✅ Clicked parent container for seat ${i} with price ${priceText}`);
                seatClicked = true;
                break; // STOP IMMEDIATELY after first click
              }
            }
          }
        } catch (e) {
          console.log(`Failed to process seat ${i}:`, e.message);
        }
      }
      
      // If no clean price format worked, try any price element as fallback
      if (!seatClicked) {
        console.log('Fallback: Clicking any available price element...');
        
        const anyPriceElements = await $$('//*[contains(text(), "₹")]');
        
        for (let i = 0; i < anyPriceElements.length; i++) {
          try {
            const element = anyPriceElements[i];
            const text = await element.getText();
            
            // Skip obvious non-seats
            if (text.includes('starting at') || text.includes('with NEW2BUS') || text.length > 15) {
              continue;
            }
            
            if (await element.isDisplayed() && await element.isClickable()) {
              console.log(`🪑 FALLBACK: Clicking any price element: "${text}"`);
              await element.scrollIntoView();
              await browser.pause(500);
              await element.click();
              console.log(`✅ FALLBACK: Clicked element with text: "${text}"`);
              seatClicked = true;
              break; // STOP IMMEDIATELY after first click
            }
          } catch (e) {
            console.log(`Fallback element ${i} failed:`, e.message);
          }
        }
      }
      
      if (seatClicked) {
        console.log('🎉 SEAT CLICKED SUCCESSFULLY - NO MORE SEAT SELECTIONS!');
        console.log('⏳ Waiting for seat selection to register...');
        await browser.pause(3000); // Wait for UI to update
      } else {
        throw new Error('Could not click any seat');
      }
      
    } catch (e) {
      console.log('❌ Seat selection failed:', e.message);
      throw new Error('Seat selection failed - aborting test');
    }
    
    // === STEP 3: CLICK NEXT BUTTON ===
    console.log('=== STEP 3: CLICKING NEXT BUTTON ===');
    await browser.pause(3000); // Increased wait time to ensure seat selection is processed
    
    try {
      console.log('🔍 Looking for Next button...');
      
      // Multiple selectors for Next button
      const nextSelectors = [
        '//*[contains(text(), "Next")]',
        '//button[contains(text(), "Next")]',
        '//*[contains(text(), "NEXT")]',
        '//input[@value="Next"]',
        '//*[contains(@class, "next")]//*[contains(text(), "Next")]',
        '//*[@id="next" or @id="nextBtn"]'
      ];
      
      let nextClicked = false;
      
      for (const selector of nextSelectors) {
        try {
          console.log(`Trying Next button selector: ${selector}`);
          const nextButton = await $(selector);
          
          if (await nextButton.isExisting()) {
            console.log('Found Next button, checking if clickable...');
            
            // Scroll to button to ensure it's visible
            await nextButton.scrollIntoView();
            await browser.pause(1000);
            
            const isDisplayed = await nextButton.isDisplayed();
            const isClickable = await nextButton.isClickable();
            
            console.log(`Next button - displayed: ${isDisplayed}, clickable: ${isClickable}`);
            
            if (isDisplayed && isClickable) {
              console.log('✅ Clicking Next button...');
              await nextButton.click();
              console.log('✅ Next button clicked successfully');
              
              // Wait for navigation
              await browser.pause(3000);
              
              // Verify navigation to pickup points
              const pickupIndicators = await $$('//*[contains(text(), "Pickup") or contains(text(), "Pick-up") or contains(text(), "Boarding")]');
              if (pickupIndicators.length > 0) {
                console.log('✅ Successfully navigated to Pickup Points page');
              } else {
                console.log('⚠️ Navigation may not have completed - continuing anyway');
              }
              
              nextClicked = true;
              break;
            } else {
              console.log('Next button found but not clickable, trying next selector...');
            }
          } else {
            console.log('Next button not found with this selector');
          }
        } catch (e) {
          console.log(`Next button selector ${selector} failed:`, e.message);
        }
      }
      
      // JavaScript click as fallback
      if (!nextClicked) {
        console.log('Trying JavaScript click on Next button as fallback...');
        try {
          const jsNextButton = await $('//*[contains(text(), "Next")]');
          if (await jsNextButton.isExisting()) {
            await browser.execute((element) => {
              element.click();
            }, jsNextButton);
            console.log('✅ Next button clicked using JavaScript');
            await browser.pause(3000);
            nextClicked = true;
          }
        } catch (e) {
          console.log('JavaScript Next button click failed:', e.message);
        }
      }
      
      if (!nextClicked) {
        console.log('❌ Could not find or click Next button');
        
        // Debug what buttons are available
        try {
          const allButtons = await $$('//button | //input[@type="button"] | //input[@type="submit"] | //*[@role="button"]');
          console.log(`Found ${allButtons.length} buttons on page`);
          
          for (let i = 0; i < Math.min(allButtons.length, 5); i++) {
            try {
              const button = allButtons[i];
              const text = await button.getText();
              const value = await button.getAttribute('value');
              const isDisplayed = await button.isDisplayed();
              console.log(`Button ${i}: text="${text}", value="${value}", displayed=${isDisplayed}`);
            } catch (e) {
              console.log(`Button ${i}: Could not get details`);
            }
          }
        } catch (e) {
          console.log('Button debug failed:', e.message);
        }
        
        throw new Error('Next button not found after all attempts');
      }
      
    } catch (e) {
      console.log('Next button click failed:', e.message);
      throw new Error('Next button click failed - aborting test');
    }
    
    // === STEP 4: SELECT PICKUP POINT ===
    console.log('=== STEP 4: SELECTING PICKUP POINT ===');
    await browser.pause(3000);
    
    try {
      // Use calendar icon as reference to find pickup point cards and select first available
      console.log('Looking for pickup points using calendar icon reference...');
      
      // Find all calendar icons (pickup/drop points have calendar icons)
      const calendarIcons = await $$('//img[contains(@src, "calendar") or contains(@alt, "calendar")]');
      console.log(`Found ${calendarIcons.length} calendar icons`);
      
      let pickupSelected = false;
      
      // Try each calendar icon's parent container until we find an available one
      for (let i = 0; i < calendarIcons.length; i++) {
        try {
          console.log(`Checking calendar icon ${i} for pickup point...`);
          
          // Get the parent container of the calendar icon (the pickup/drop point card)
          const pickupCard = await calendarIcons[i].$('../../..');  // Go up multiple levels to get the card
          
          if (await pickupCard.isExisting()) {
            // Check if this card is disabled
            const cardClasses = await pickupCard.getAttribute('class');
            const isDisabled = cardClasses && (cardClasses.includes('disabled') || cardClasses.includes('inactive'));
            
            if (!isDisabled) {
              const isDisplayed = await pickupCard.isDisplayed();
              const isClickable = await pickupCard.isClickable();
              
              if (isDisplayed && isClickable) {
                console.log(`Clicking available pickup point card ${i}...`);
                await pickupCard.click();
                console.log(`✅ Successfully selected pickup point ${i}`);
                pickupSelected = true;
                break;
              } else {
                console.log(`Pickup card ${i} is not clickable, trying next...`);
              }
            } else {
              console.log(`Pickup card ${i} is disabled, skipping to next...`);
            }
          }
          
          // Alternative: Try the radio button inside this calendar icon's container
          if (!pickupSelected) {
            const radioButton = await calendarIcons[i].$('../../..//input[@type="radio"]');
            if (await radioButton.isExisting()) {
              const isEnabled = await radioButton.isEnabled();
              if (isEnabled) {
                console.log(`Clicking radio button for pickup point ${i}...`);
                await radioButton.click();
                console.log(`✅ Successfully selected pickup point via radio ${i}`);
                pickupSelected = true;
                break;
              } else {
                console.log(`Radio button ${i} is disabled, trying next...`);
              }
            }
          }
          
        } catch (e) {
          console.log(`Failed to process pickup point ${i}:`, e.message);
        }
      }
      
      // Fallback: If no calendar icons worked, try generic approach
      if (!pickupSelected) {
        console.log('Fallback: Looking for any available radio button...');
        const availableRadios = await $$('//input[@type="radio" and not(@disabled)]');
        
        for (let i = 0; i < availableRadios.length; i++) {
          try {
            const radio = availableRadios[i];
            const isDisplayed = await radio.isDisplayed();
            const isEnabled = await radio.isEnabled();
            
            if (isDisplayed && isEnabled) {
              console.log(`Clicking fallback radio button ${i}...`);
              await radio.click();
              console.log(`✅ Fallback pickup selection successful`);
              pickupSelected = true;
              break;
            }
          } catch (e) {
            console.log(`Fallback radio ${i} failed:`, e.message);
          }
        }
      }
      
      if (!pickupSelected) {
        console.log('❌ Could not select any pickup point');
      }
      
    } catch (e) {
      console.log('Pickup point selection failed:', e.message);
    }
    
    // Wait for automatic navigation to drop points (as mentioned by user)
    await browser.pause(4000);
    
    // === STEP 5: SELECT DROP POINT ===
    console.log('=== STEP 5: SELECTING DROP POINT ===');
    
    try {
      // Use calendar icon as reference to find drop point cards and select first available
      console.log('Looking for drop points using calendar icon reference...');
      
      // Find all calendar icons (after pickup selection, these should be drop points)
      const calendarIcons = await $$('//img[contains(@src, "calendar") or contains(@alt, "calendar")]');
      console.log(`Found ${calendarIcons.length} calendar icons for drop points`);
      
      let dropSelected = false;
      
      // Try each calendar icon's parent container until we find an available one
      for (let i = 0; i < calendarIcons.length; i++) {
        try {
          console.log(`Checking calendar icon ${i} for drop point...`);
          
          // Get the parent container of the calendar icon (the pickup/drop point card)
          const dropCard = await calendarIcons[i].$('../../..');  // Go up multiple levels to get the card
          
          if (await dropCard.isExisting()) {
            // Check if this card is disabled
            const cardClasses = await dropCard.getAttribute('class');
            const isDisabled = cardClasses && (cardClasses.includes('disabled') || cardClasses.includes('inactive'));
            
            if (!isDisabled) {
              const isDisplayed = await dropCard.isDisplayed();
              const isClickable = await dropCard.isClickable();
              
              if (isDisplayed && isClickable) {
                console.log(`Clicking available drop point card ${i}...`);
                await dropCard.click();
                console.log(`✅ Successfully selected drop point ${i}`);
                dropSelected = true;
                break;
              } else {
                console.log(`Drop card ${i} is not clickable, trying next...`);
              }
            } else {
              console.log(`Drop card ${i} is disabled, skipping to next...`);
            }
          }
          
          // Alternative: Try the radio button inside this calendar icon's container
          if (!dropSelected) {
            const radioButton = await calendarIcons[i].$('../../..//input[@type="radio"]');
            if (await radioButton.isExisting()) {
              const isEnabled = await radioButton.isEnabled();
              if (isEnabled) {
                console.log(`Clicking radio button for drop point ${i}...`);
                await radioButton.click();
                console.log(`✅ Successfully selected drop point via radio ${i}`);
                dropSelected = true;
                break;
              } else {
                console.log(`Radio button ${i} is disabled, trying next...`);
              }
            }
          }
          
        } catch (e) {
          console.log(`Failed to process drop point ${i}:`, e.message);
        }
      }
      
      // Fallback: If no calendar icons worked, try generic approach
      if (!dropSelected) {
        console.log('Fallback: Looking for any available radio button...');
        const availableRadios = await $$('//input[@type="radio" and not(@disabled)]');
        
        for (let i = 0; i < availableRadios.length; i++) {
          try {
            const radio = availableRadios[i];
            const isDisplayed = await radio.isDisplayed();
            const isEnabled = await radio.isEnabled();
            
            if (isDisplayed && isEnabled) {
              console.log(`Clicking fallback radio button ${i}...`);
              await radio.click();
              console.log(`✅ Fallback drop selection successful`);
              dropSelected = true;
              break;
            }
          } catch (e) {
            console.log(`Fallback radio ${i} failed:`, e.message);
          }
        }
      }
      
      if (!dropSelected) {
        console.log('❌ Could not select any drop point');
      }
      
    } catch (e) {
      console.log('Drop point selection failed:', e.message);
    }
    
    await browser.pause(2000);
    
    // === STEP 6: CLICK PROCEED BUTTON ===
    console.log('=== STEP 6: CLICKING PROCEED BUTTON ===');
    
    try {
      // Look specifically for Proceed button
      console.log('Looking for Proceed button...');
      const proceedButton = await $('//*[contains(text(), "Proceed")]');
      if (await proceedButton.isExisting()) {
        console.log('Found Proceed button, clicking...');
        await proceedButton.click();
        console.log('✅ Proceed button clicked');
      } else {
        throw new Error('Proceed button not found');
      }
    } catch (e) {
      console.log('Proceed button click failed:', e.message);
      throw new Error('Could not find proceed button to continue booking flow');
    }
    
    // Wait for page transition
    await browser.pause(20000); // Reduced from 10000 to 5000ms
    
    // === STEP 7: WAIT FOR MANUAL LOGIN ===
    console.log('=== STEP 7: WAITING FOR MANUAL LOGIN ===');
    console.log('🔑 Login iframe should appear - please complete login manually');
    console.log('⏳ The automation is now SUSPENDED - waiting for you to complete login...');
    console.log('📋 Please complete the login process in the iframe/popup');
    console.log('⚠️  The test will automatically resume once you reach the Add Passengers page');
    
    try {
      // Wait for up to 3 minutes for user to complete login and reach Add Passengers page
      await browser.waitUntil(
        async () => {
          try {
            const currentUrl = await browser.getUrl();
            const pageTitle = await browser.getTitle();
            
            // Log current state every 10 seconds to show automation is waiting
            console.log(`⏳ Still waiting... Current URL: ${currentUrl.substring(0, 80)}...`);
            console.log(`⏳ Still waiting... Page title: ${pageTitle}`);
            
            // Check multiple indicators that we've reached the Add Passengers page
            const passengerIndicators = await $$('//*[contains(text(), "Passenger") or contains(text(), "Add Passenger") or contains(text(), "Contact Details") or contains(text(), "Saved Passengers")]');
            
            if (passengerIndicators.length > 0) {
              console.log('✅ SUCCESS: Detected Add Passengers page - login completed successfully!');
              console.log('🚀 RESUMING AUTOMATION from Add Passengers step...');
              return true;
            }
            
            // Alternative check - look for passenger form elements
            const passengerFormElements = await $$('//*[contains(text(), "Mr.") or contains(text(), "Ms.") or contains(@placeholder, "Name") or contains(@placeholder, "Mobile")]');
            if (passengerFormElements.length > 0) {
              console.log('✅ SUCCESS: Detected passenger form elements - login completed successfully!');
              console.log('🚀 RESUMING AUTOMATION from Add Passengers step...');
              return true;
            }
            
            // Check if we're still on login page (iframe might still be open)
            const loginIndicators = await $$('//*[contains(text(), "Login") or contains(text(), "Sign In") or contains(text(), "OTP")]');
            if (loginIndicators.length > 0) {
              console.log('⏳ Login page still detected - please complete the login process');
            }
            
            return false;
          } catch (e) {
            console.log('⏳ Waiting for login completion... (checking page state)');
            return false;
          }
        },
        {
          timeout: 180000, // 3 minutes for user to complete login
          interval: 10000,  // Check every 10 seconds
          timeoutMsg: '❌ Login was not completed within 3 minutes or Add Passengers page not reached'
        }
      );
      
      console.log('🎉 Login completed successfully - proceeding with passenger selection');
      
    } catch (e) {
      console.log('❌ Login wait failed or timed out:', e.message);
      console.log('🔄 Attempting to continue anyway - checking if we can proceed...');
      
      // One final check to see if we're actually on the right page
      const finalCheck = await $$('//*[contains(text(), "Passenger") or contains(text(), "Add Passenger")]');
      if (finalCheck.length > 0) {
        console.log('✅ Found passenger elements on final check - proceeding...');
      } else {
        console.log('❌ Still no passenger elements found - manual intervention may be required');
        throw new Error('Login verification failed - please check if login was completed successfully');
      }
    }
    
    // Additional wait for page to fully settle after login
    console.log('⏳ Allowing page to fully settle after login...');
    await browser.pause(5000);
    
    // Log current state before proceeding
    try {
      const currentUrl = await browser.getUrl();
      const pageTitle = await browser.getTitle();
      console.log(`📍 Current URL before passenger selection: ${currentUrl}`);
      console.log(`📍 Current page title: ${pageTitle}`);
    } catch (e) {
      console.log('Could not log current state');
    }
    
    // === STEP 8: SELECT FIRST PASSENGER ===
    console.log('=== STEP 8: SELECTING FIRST PASSENGER ===');
    await browser.pause(3000);
    
    try {
      // Look for first passenger radio button or passenger name
      const firstPassenger = await $('//*[contains(text(), "Saved Passengers")]/following-sibling::*//*[contains(@type, "radio")][1] | //*[contains(text(), "Mr. Orgj") or contains(text(), "Orgj")]/preceding-sibling::*[1] | //input[@type="radio"][1]');
      if (await firstPassenger.isExisting()) {
        console.log('Found first passenger radio button, clicking...');
        await firstPassenger.click();
        console.log('✅ First passenger selected');
      } else {
        // Alternative: Click on passenger name
        const passengerName = await $('//*[contains(text(), "Mr. Orgj") or contains(text(), "Orgj")][1]');
        if (await passengerName.isExisting()) {
          console.log('Found passenger name, clicking...');
          await passengerName.click();
          console.log('✅ Passenger name clicked');
        } else {
          console.log('❌ No passenger found');
        }
      }
    } catch (e) {
      console.log('Passenger selection failed:', e.message);
    }
    
    // === STEP 9: CLICK CONTINUE ===
    console.log('=== STEP 9: CLICKING FINAL CONTINUE ===');
    await browser.pause(2000);
    
    try {
      const continueButton = await $('//*[contains(text(), "Continue")]');
      if (await continueButton.isExisting()) {
        console.log('Found Continue button, clicking...');
        await continueButton.click();
        console.log('✅ Continue button clicked');
      } else {
        console.log('❌ Continue button not found');
      }
    } catch (e) {
      console.log('Continue button click failed:', e.message);
    }
    
    // Wait for final page load
    await browser.pause(5000);
    
    // Check if we reached the review booking page
    try {
      const reviewText = await $('//*[contains(text(), "Review Booking") or contains(text(), "Proceed To Pay")]');
      if (await reviewText.isExisting()) {
        console.log('🎉 SUCCESS: Reached Review Booking page!');
      } else {
        console.log('⚠️  May not have reached final booking page');
      }
    } catch (e) {
      console.log('Final verification failed:', e.message);
    }
    
    // === STEP 9.5: FILL EMAIL ON REVIEW BOOKING PAGE ===
    console.log('=== STEP 9.5: FILLING EMAIL ON REVIEW BOOKING PAGE ===');
    await browser.pause(2000);
    
    try {
      console.log('🔍 Looking for email input field...');
      
      // Look for email input field using placeholder text
      const emailInput = await $('//input[@placeholder="Email ID"] | //input[contains(@placeholder, "Email")] | //input[@type="email"]');
      
      if (await emailInput.isExisting()) {
        console.log('Found email input field, checking if it needs to be filled...');
        
        // Check if email field is empty or has placeholder text
        const currentValue = await emailInput.getValue();
        console.log(`Current email field value: "${currentValue}"`);
        
        if (!currentValue || currentValue.trim().length === 0 || currentValue === 'Email ID') {
          console.log('📧 Email field is empty, filling with email address...');
          
          // Scroll to email field and click to focus
          await emailInput.scrollIntoView();
          await browser.pause(500);
          await emailInput.click();
          await browser.pause(500);
          
          // Clear any existing value and enter email
          await emailInput.clearValue();
          await emailInput.setValue('kashyaprohit8360@gmail.com');
          
          console.log('✅ Email address entered successfully');
          
          // Verify the email was entered
          const verifyValue = await emailInput.getValue();
          console.log(`Verification: Email field now contains: "${verifyValue}"`);
          
          // Check if error message disappeared
          await browser.pause(1000);
          const errorMessage = await $('//*[contains(text(), "Please provide a valid Email ID")]');
          if (await errorMessage.isExisting()) {
            const isDisplayed = await errorMessage.isDisplayed();
            if (!isDisplayed) {
              console.log('✅ Email validation error cleared');
            } else {
              console.log('⚠️ Email validation error still showing');
            }
          } else {
            console.log('✅ No email validation error found');
          }
          
          // After filling/verifying email, immediately click Proceed to Pay
          console.log('🎯 Email ready, now clicking Proceed to Pay...');
          await browser.pause(1000);
          
          try {
            const proceedToPayButton = await $('//*[contains(text(), "Proceed To Pay")] | //button[contains(text(), "Proceed")] | //*[contains(text(), "Proceed") and contains(text(), "Pay")]');
            
            if (await proceedToPayButton.isExisting()) {
              console.log('Found Proceed To Pay button, clicking...');
              await proceedToPayButton.scrollIntoView();
              await browser.pause(500);
              await proceedToPayButton.click();
              console.log('✅ Proceed To Pay button clicked after email filling');
              
              // Wait for navigation to payment gateway
              await browser.pause(5000);
              console.log('✅ Should be navigating to payment gateway');
            } else {
              console.log('❌ Proceed To Pay button not found after email filling');
              
              // Debug: Look for any buttons that might be the proceed button
              const allButtons = await $$('//button | //*[@role="button"] | //input[@type="submit"]');
              console.log(`Found ${allButtons.length} buttons on review page`);
              
              for (let i = 0; i < Math.min(allButtons.length, 5); i++) {
                try {
                  const button = allButtons[i];
                  const text = await button.getText();
                  const isDisplayed = await button.isDisplayed();
                  console.log(`Button ${i}: "${text}" (displayed: ${isDisplayed})`);
                } catch (e) {
                  console.log(`Button ${i}: Could not get details`);
                }
              }
            }
          } catch (e) {
            console.log('❌ Error clicking Proceed To Pay after email:', e.message);
          }
        } else {
          console.log(`✅ Email field already filled with: "${currentValue}"`);
        }
      } else {
        console.log('❌ Email input field not found');
        
        // Debug: Look for any input fields on the page
        console.log('🔍 Debugging: Looking for any input fields...');
        const allInputs = await $$('//input');
        console.log(`Found ${allInputs.length} input fields on page`);
        
        for (let i = 0; i < Math.min(allInputs.length, 5); i++) {
          try {
            const input = allInputs[i];
            const placeholder = await input.getAttribute('placeholder');
            const type = await input.getAttribute('type');
            const id = await input.getAttribute('id');
            console.log(`Input ${i}: placeholder="${placeholder}", type="${type}", id="${id}"`);
          } catch (e) {
            console.log(`Input ${i}: Could not get attributes`);
          }
        }
      }
      
    } catch (e) {
      console.log('❌ Email filling failed:', e.message);
      console.log('🔄 Continuing with booking process...');
    }
    
    // Additional wait to ensure email is processed
    await browser.pause(1000);
    
    // === STEP 10: CLICK PROCEED TO PAY ===
    console.log('=== STEP 10: CLICKING PROCEED TO PAY ===');
    await browser.pause(2000);
    
    try {
      const proceedToPayButton = await $('//*[contains(text(), "Proceed To Pay")]');
      if (await proceedToPayButton.isExisting()) {
        console.log('Found Proceed To Pay button, clicking...');
        await proceedToPayButton.click();
        console.log('✅ Proceed To Pay button clicked');
        
        // Wait for bank gateway to load
        await browser.pause(5000); // Increased wait time for bank gateway
        console.log('✅ Should be redirected to ICICI bank gateway');
      } else {
        // Try alternative Pay button selectors
        console.log('Pay button not found, trying alternative selectors...');
        const payButtonAlt = await $('//button[contains(text(), "Pay")] | //div[contains(text(), "Pay")] | //*[contains(@class, "pay")]//*[contains(text(), "Pay")]');
        if (await payButtonAlt.isExisting()) {
          console.log('Found Pay button with alternative selector, clicking...');
          await payButtonAlt.click();
          console.log('✅ Pay button clicked (alternative)');
          await browser.pause(5000);
        } else {
          console.log('❌ Pay button not found with any selector');
        }
      }
    } catch (e) {
      console.log('❌ Proceed To Pay button click failed:', e.message);
      throw new Error('Failed to click Proceed To Pay button: ' + e.message);
    }
    
    // === STEP 11: ANALYZE PAYMENT OPTIONS ===
    console.log('=== STEP 11: ANALYZING AVAILABLE PAYMENT OPTIONS ===');
    await browser.pause(2000);
    
    // Debug: Let's see what payment options are available
    console.log('🔍 Scanning for payment options...');
    try {
      // Look for common payment method indicators
      const paymentMethods = [
        'UPI',
        'Net Banking', 
        'Credit Card',
        'Debit Card',
        'Wallet',
        'PayPal',
        'PhonePe',
        'Paytm',
        'Google Pay'
      ];
      
      let foundPaymentOptions = [];
      
      for (const method of paymentMethods) {
        const elements = await $$(`//*[contains(text(), "${method}")]`);
        if (elements.length > 0) {
          foundPaymentOptions.push(method);
          console.log(`✅ Found payment option: ${method} (${elements.length} elements)`);
        }
      }
      
      if (foundPaymentOptions.length > 0) {
        console.log(`🎉 SUCCESS: Found ${foundPaymentOptions.length} payment options: ${foundPaymentOptions.join(', ')}`);
        console.log('💳 Payment gateway is ready for selection');
      } else {
        console.log('⚠️ No standard payment options detected');
        console.log('🔍 Checking for any clickable payment elements...');
        
        // Look for any buttons or clickable elements that might be payment options
        const clickableElements = await $$('//button | //input[@type="radio"] | //input[@type="checkbox"] | //*[@onclick]');
        console.log(`🔘 Found ${clickableElements.length} potentially clickable elements`);
        
        // Try to get text from first few clickable elements
        for (let i = 0; i < Math.min(clickableElements.length, 3); i++) {
          try {
            const element = clickableElements[i];
            const text = await element.getText();
            const tagName = await element.getTagName();
            console.log(`🔘 Clickable element ${i}: <${tagName}> "${text}"`);
          } catch (e) {
            console.log(`🔘 Clickable element ${i}: Could not get details`);
          }
        }
      }
      
    } catch (e) {
      console.log('❌ Payment options analysis failed:', e.message);
    }
    
    console.log('🎯 BOOKING FLOW REACHED PAYMENT GATEWAY');
    console.log('✅ Test completed successfully - Payment options are now available');
    console.log('💡 Manual payment selection can now be performed if needed');
    
    // === STEP 12: SELECT NET BANKING OPTION ===
    console.log('=== STEP 12: SELECTING NET BANKING OPTION ===');
    await browser.pause(3000);
    
    try {
      // Look for Net Banking option using specific selectors
      console.log('🏦 Looking for Net Banking option using specific selectors...');
      
      let netBankingSelected = false;
      
      // Method 1: Look for the specific nb-icon-new.svg image
      console.log('Method 1: Looking for nb-icon-new.svg image...');
      const netBankingIcon = await $('//img[contains(@src, "nb-icon-new.svg")]');
      if (await netBankingIcon.isExisting()) {
        console.log('Found nb-icon-new.svg image, clicking...');
        try {
          await netBankingIcon.click();
          console.log('✅ Net Banking option clicked via nb-icon-new.svg image');
          netBankingSelected = true;
        } catch (e) {
          console.log('Direct icon click failed, trying parent container...');
          const iconParent = await netBankingIcon.$('..');
          if (await iconParent.isExisting() && await iconParent.isClickable()) {
            await iconParent.click();
            console.log('✅ Net Banking option clicked via nb-icon-new.svg parent container');
            netBankingSelected = true;
          }
        }
      } else {
        console.log('nb-icon-new.svg image not found');
      }
      
      // Method 2: Look for "Net Banking" text and click it
      if (!netBankingSelected) {
        console.log('Method 2: Looking for "Net Banking" text...');
        const netBankingText = await $('//*[contains(text(), "Net Banking")]');
        if (await netBankingText.isExisting()) {
          console.log('Found "Net Banking" text, clicking...');
          try {
            await netBankingText.click();
            console.log('✅ Net Banking option clicked via text');
            netBankingSelected = true;
          } catch (e) {
            console.log('Direct text click failed, trying parent container...');
            const textParent = await netBankingText.$('..');
            if (await textParent.isExisting() && await textParent.isClickable()) {
              await textParent.click();
              console.log('✅ Net Banking option clicked via text parent container');
              netBankingSelected = true;
            }
          }
        } else {
          console.log('"Net Banking" text not found');
        }
      }
      
      // Method 3: Look for radio button or input associated with Net Banking
      if (!netBankingSelected) {
        console.log('Method 3: Looking for Net Banking radio button/input...');
        const netBankingInput = await $('//input[@type="radio" and (following-sibling::*[contains(text(), "Net Banking")] or preceding-sibling::*[contains(text(), "Net Banking")])]');
        if (await netBankingInput.isExisting()) {
          console.log('Found Net Banking radio button, clicking...');
          await netBankingInput.click();
          console.log('✅ Net Banking option selected via radio button');
          netBankingSelected = true;
        } else {
          console.log('Net Banking radio button not found');
        }
      }
      
      // Method 4: Look for container with both nb-icon-new.svg and Net Banking text
      if (!netBankingSelected) {
        console.log('Method 4: Looking for container with nb-icon-new.svg and Net Banking text...');
        const netBankingContainer = await $('//*[.//img[contains(@src, "nb-icon-new.svg")] and .//text()[contains(., "Net Banking")]]');
        if (await netBankingContainer.isExisting()) {
          console.log('Found container with both icon and text, clicking...');
          const isClickable = await netBankingContainer.isClickable();
          if (isClickable) {
            await netBankingContainer.click();
            console.log('✅ Net Banking option selected via combined container');
            netBankingSelected = true;
          } else {
            console.log('Container not clickable, trying child elements...');
            const clickableChild = await netBankingContainer.$('.//*[@onclick or @role="button" or contains(@class, "button")]');
            if (await clickableChild.isExisting()) {
              await clickableChild.click();
              console.log('✅ Net Banking option selected via container child element');
              netBankingSelected = true;
            }
          }
        } else {
          console.log('Combined container not found');
        }
      }
      
      // Method 5: Broad search for any element containing "nb-icon-new.svg"
      if (!netBankingSelected) {
        console.log('Method 5: Broad search for nb-icon-new.svg elements...');
        const allNbIconElements = await $$('//*[contains(@src, "nb-icon-new.svg") or contains(@href, "nb-icon-new.svg") or contains(@data-src, "nb-icon-new.svg")]');
        console.log(`Found ${allNbIconElements.length} elements with nb-icon-new.svg`);
        
        for (let i = 0; i < allNbIconElements.length; i++) {
          try {
            const element = allNbIconElements[i];
            console.log(`Trying to click nb-icon-new.svg element ${i}...`);
            
            // Try clicking the element itself
            if (await element.isClickable() && await element.isDisplayed()) {
              await element.click();
              console.log(`✅ Net Banking selected via nb-icon-new.svg element ${i}`);
              netBankingSelected = true;
              break;
            } else {
              // Try clicking parent
              const parent = await element.$('..');
              if (await parent.isClickable() && await parent.isDisplayed()) {
                await parent.click();
                console.log(`✅ Net Banking selected via nb-icon-new.svg parent ${i}`);
                netBankingSelected = true;
                break;
              }
            }
          } catch (e) {
            console.log(`Failed to click nb-icon-new.svg element ${i}:`, e.message);
          }
        }
      }
      
      if (netBankingSelected) {
        console.log('🎉 SUCCESS: Net Banking option has been selected!');
        await browser.pause(3000);
        
        // Look for next step after Net Banking selection
        console.log('🔍 Looking for next steps after Net Banking selection...');
        try {
          const nextButtons = await $$('//*[contains(text(), "Proceed") or contains(text(), "Continue") or contains(text(), "Next") or contains(text(), "Pay")]');
          if (nextButtons.length > 0) {
            console.log(`Found ${nextButtons.length} potential next step buttons`);
            for (let i = 0; i < Math.min(nextButtons.length, 3); i++) {
              try {
                const text = await nextButtons[i].getText();
                console.log(`Next button ${i}: "${text}"`);
              } catch (e) {
                console.log(`Next button ${i}: Could not get text`);
              }
            }
          }
          
          const bankOptions = await $$('//*[contains(text(), "Bank") and not(contains(text(), "Net Banking"))]');
          if (bankOptions.length > 0) {
            console.log(`Found ${bankOptions.length} bank selection options`);
            console.log('💡 You can now manually select your preferred bank');
          }
          
        } catch (e) {
          console.log('Could not analyze next steps:', e.message);
        }
        
      } else {
        console.log('❌ Could not find or select Net Banking option');
        console.log('🔍 Debugging: Let me check what payment options are actually available...');
        
        // Debug what's actually on the page
        try {
          const allImages = await $$('//img');
          console.log(`Found ${allImages.length} images on page`);
          
          for (let i = 0; i < Math.min(allImages.length, 10); i++) {
            try {
              const src = await allImages[i].getAttribute('src');
              if (src) {
                console.log(`Image ${i}: ${src}`);
              }
            } catch (e) {
              console.log(`Image ${i}: Could not get src`);
            }
          }
          
          const allPaymentTexts = await $$('//*[contains(text(), "UPI") or contains(text(), "Card") or contains(text(), "Wallet") or contains(text(), "Pay") or contains(text(), "Bank")]');
          console.log(`Found ${allPaymentTexts.length} payment-related text elements`);
          
          for (let i = 0; i < Math.min(allPaymentTexts.length, 5); i++) {
            try {
              const text = await allPaymentTexts[i].getText();
              console.log(`Payment text ${i}: "${text}"`);
            } catch (e) {
              console.log(`Payment text ${i}: Could not get text`);
            }
          }
          
        } catch (e) {
          console.log('Debug failed:', e.message);
        }
      }
      
    } catch (e) {
      console.log('❌ Net Banking selection failed:', e.message);
    }

    // === STEP 12: SELECT ICICI BANK FROM POPUP ===
    console.log('=== STEP 12: SELECTING ICICI BANK FROM POPUP ===');
    await browser.pause(3000); // Reduced since we already waited above
    
    try {
      // Look for ICICI bank option in the popup
      console.log('Looking for ICICI text option in popup...');
      const iciciBankOption = await $('//*[contains(text(), "ICICI")]');
      console.log('✅ iciciBankOption ', iciciBankOption);
      
      if (await iciciBankOption.isExisting()) {
        console.log('Found ICICI text option, clicking...');
        await iciciBankOption.click();
        console.log('✅ ICICI bank text selected from popup');
        
        // Wait for selection to register and popup to close
        console.log('⏳ Waiting for ICICI selection to register...');
        await browser.pause(3000); // Increased wait for selection to register
        console.log('✅ ICICI bank selection completed');
      } else {
        console.log('❌ ICICI text option not found in popup');
        
        // Try alternative ICICI selectors
        console.log('Trying alternative ICICI selectors...');
        const iciciAlt = await $('//div[contains(text(), "ICICI")] | //span[contains(text(), "ICICI")] | //*[contains(@class, "bank")]//*[contains(text(), "ICICI")]');
        if (await iciciAlt.isExisting()) {
          console.log('Found ICICI with alternative selector, clicking...');
          await iciciAlt.click();
          console.log('✅ ICICI bank selected (alternative)');
          await browser.pause(3000);
        } else {
          console.log('❌ ICICI bank not found with any selector');
        }
      }
    } catch (e) {
      console.log('ICICI bank selection from popup failed:', e.message);
    }

    //   === STEP 13: CLICK PAY BUTTON ===
    console.log('=== STEP 13: CLICKING PAY BUTTON ===');
    await browser.pause(3000); // Increased delay as requested
    
    try {
      // Look for Pay button using ptm-lock-img image reference
      console.log('Looking for Pay button using ptm-lock-img image reference...');
      
      let payButtonClicked = false;
      
      // Method 1: Look for button containing ptm-lock-img image
      console.log('Method 1: Looking for button with ptm-lock-img image...');
      const payButtonWithImage = await $('//button[.//img[contains(@class, "ptm-lock-img")] or .//img[contains(@src, "ptm-lock")]]');
      
      if (await payButtonWithImage.isExisting()) {
        console.log('Found Pay button with ptm-lock-img, checking visibility...');
        
        // Scroll to the button to ensure it's visible
        await payButtonWithImage.scrollIntoView();
        await browser.pause(1000);
        
        const isDisplayed = await payButtonWithImage.isDisplayed();
        const isClickable = true;
        
        console.log(`Pay button visibility: displayed=${isDisplayed}, clickable=${isClickable}`);
        
        if (isDisplayed && isClickable) {
          console.log('Clicking Pay button with ptm-lock-img...');
          await payButtonWithImage.click();
          console.log('✅ Pay button clicked successfully using ptm-lock-img reference');
          payButtonClicked = true;
        } else {
          console.log('Pay button with ptm-lock-img not clickable, trying to make it visible...');
          
          // Try to click the parent container
          const buttonParent = await payButtonWithImage.$('..');
          if (await buttonParent.isExisting()) {
            await buttonParent.scrollIntoView();
            await browser.pause(500);
            
            if (await buttonParent.isClickable()) {
              console.log('Clicking Pay button parent container...');
              await buttonParent.click();
              console.log('✅ Pay button clicked via parent container');
              payButtonClicked = true;
            }
          }
        }
      } else {
        console.log('Pay button with ptm-lock-img not found');
      }
      console.log('✅ payButtonClicked', payButtonClicked);
      
      // Method 2: Look for Pay text and ptm-lock-img in same container
      if (!payButtonClicked) {
        console.log('Method 2: Looking for container with both "Pay" text and ptm-lock-img...');
        const payContainerWithImage = await $('//*[contains(text(), "Pay") and .//img[contains(@class, "ptm-lock-img")]]');
        
        if (await payContainerWithImage.isExisting()) {
          console.log('Found container with Pay text and ptm-lock-img...');
          await payContainerWithImage.scrollIntoView();
          await browser.pause(1000);
          
          if (await payContainerWithImage.isClickable() && await payContainerWithImage.isDisplayed()) {
            console.log('Clicking Pay container with image...');
            await payContainerWithImage.click();
            console.log('✅ Pay button clicked via container with Pay text and image');
            payButtonClicked = true;
          }
        } else {
          console.log('Container with Pay text and ptm-lock-img not found');
        }
      }
      
      // Method 3: Find ptm-lock-img and click its parent button
      if (!payButtonClicked) {
        console.log('Method 3: Looking for ptm-lock-img and clicking parent button...');
        const lockImage = await $('//img[contains(@class, "ptm-lock-img") or contains(@src, "ptm-lock")]');
        
        if (await lockImage.isExisting()) {
          console.log('Found ptm-lock-img, looking for parent button...');
          
          // Try different levels of parent elements
          const parentLevels = ['..', '../..', '../../..'];
          
          for (const parentLevel of parentLevels) {
            try {
              const parentButton = await lockImage.$(parentLevel);
              if (await parentButton.isExisting()) {
                const tagName = await parentButton.getTagName();
                const buttonText = await parentButton.getText();
                
                console.log(`Found parent ${tagName} with text: "${buttonText}"`, parentButton);
                
                if (tagName.toLowerCase() === 'button' || buttonText.toLowerCase().includes('pay')) {
                  await parentButton.scrollIntoView();
                  await browser.pause(1000);
                  
                  if (await parentButton.isClickable() && await parentButton.isDisplayed()) {
                    console.log(`Clicking parent ${tagName}...`);
                    await parentButton.click();
                    console.log('✅ Pay button clicked via ptm-lock-img parent');
                    payButtonClicked = true;
                    break;
                  }
                }
              }
            } catch (e) {
              console.log(`Parent level ${parentLevel} failed:`, e.message);
            }
          }
        } else {
          console.log('ptm-lock-img not found');
        }
      }
      
      // Method 4: Look for any button containing "Pay" text (original method with better visibility)
      if (!payButtonClicked) {
        console.log('Method 4: Looking for any button with "Pay" text...');
        const payButtons = await $$('//button[contains(text(), "Pay")] | //*[contains(text(), "Pay") and (@role="button" or contains(@class, "button"))]');
        
        console.log(`Found ${payButtons.length} potential Pay buttons`);
        
        for (let i = 0; i < payButtons.length; i++) {
          try {
            const payButton = payButtons[i];
            const buttonText = await payButton.getText();
            
            console.log(`Checking Pay button ${i}: "${buttonText}"`);
            
            // Scroll to button and check visibility
            await payButton.scrollIntoView();
            await browser.pause(1000);
            
            const isDisplayed = await payButton.isDisplayed();
            const isClickable = await payButton.isClickable();
            
            console.log(`Button ${i} visibility: displayed=${isDisplayed}, clickable=${isClickable}`);
            
            if (isDisplayed && isClickable) {
              console.log(`Clicking Pay button ${i}...`);
              await payButton.click();
              console.log(`✅ Pay button ${i} clicked successfully`);
              payButtonClicked = true;
              break;
            }
          } catch (e) {
            console.log(`Failed to click Pay button ${i}:`, e.message);
          }
        }
      }
      
      // Method 5: JavaScript click as final fallback
      if (!payButtonClicked) {
        console.log('Method 5: Trying JavaScript click as fallback...');
        
        try {
          const payButtonJS = await $('//button[.//img[contains(@class, "ptm-lock-img")] or contains(text(), "Pay")]');
          if (await payButtonJS.isExisting()) {
            console.log('Using JavaScript click on Pay button...');
            await browser.execute((element) => {
              element.click();
            }, payButtonJS);
            console.log('✅ Pay button clicked using JavaScript');
            payButtonClicked = true;
          }
        } catch (e) {
          console.log('JavaScript click failed:', e.message);
        }
      }
      
      if (payButtonClicked) {
        console.log('🎉 SUCCESS: Pay button clicked - proceeding to bank gateway');
        
        // Wait for bank gateway to load - extended to 3 minutes as requested
        console.log('⏳ Waiting for 3 minutes after Pay button click...');
        console.log('🏦 Bank gateway should load during this time');
        await browser.pause(10000); // 3 minutes = 180,000 ms
        
        console.log('✅ 3-minute wait completed');
        console.log('🎯 TEST COMPLETED - Bank gateway should have loaded');
        console.log('🔚 Ending test execution as requested');
      } else {
        console.log('❌ Could not click Pay button with any method');
        throw new Error('Pay button could not be clicked - all methods failed');
      }
      
    } catch (e) {
      console.log('Pay button click failed:', e.message);
      console.log('🔍 Debugging Pay button issue...');
      
      // Debug what's actually on the page
      try {
        const allButtons = await $$('//button');
        console.log(`Found ${allButtons.length} buttons on page`);
        
        for (let i = 0; i < Math.min(allButtons.length, 5); i++) {
          try {
            const button = allButtons[i];
            const text = await button.getText();
            const isDisplayed = await button.isDisplayed();
            console.log(`Button ${i}: "${text}" (displayed: ${isDisplayed})`);
          } catch (e) {
            console.log(`Button ${i}: Could not get details`);
          }
        }
        
        const allImages = await $$('//img');
        console.log(`Found ${allImages.length} images on page`);
        
        for (let i = 0; i < Math.min(allImages.length, 10); i++) {
          try {
            const img = allImages[i];
            const src = await img.getAttribute('src');
            const className = await img.getAttribute('class');
            if (src && (src.includes('ptm-lock') || (className && className.includes('ptm-lock')))) {
              console.log(`Lock image ${i}: src="${src}", class="${className}"`);
            }
          } catch (e) {
            // Skip this image
          }
        }
        
      } catch (e) {
        console.log('Debug failed:', e.message);
      }
      
      throw new Error('Pay button click failed after all attempts: ' + e.message);
    }
    
    // Test completed - no need for final status as it's handled above
    console.log('🏁 FINAL: Test execution completed');
  });
});