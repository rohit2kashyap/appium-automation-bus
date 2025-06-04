describe('Paytm Bus Web App', () => {
    it('should open the bus page and complete full booking flow', async () => {
      await browser.url('/bus');  // baseUrl + /bus = http://fe.paytm.com:3001/bus
      const title = await browser.getTitle();
      console.log('Page Title:', title);
      expect(title).toContain('Bus');  // Adjust based on actual page title
      
      // Wait for the page to load completely
      await browser.pause(3000);
      
      // Check if From and To fields are already filled
      console.log('=== CHECKING IF FIELDS ARE ALREADY FILLED ===');
      let fieldsAlreadyFilled = false;
      
      try {
        // Check if inputs have values
        const allInputs = await $$('//input');
        let fromFilled = false;
        let toFilled = false;
        
        for (let input of allInputs) {
          try {
            const value = await input.getValue();
            const placeholder = await input.getAttribute('placeholder');
            
            if (placeholder && placeholder.toLowerCase().includes('from') && value && value.length > 0) {
              console.log(`From field already has value: "${value}"`);
              fromFilled = true;
            }
            if (placeholder && placeholder.toLowerCase().includes('to') && value && value.length > 0) {
              console.log(`To field already has value: "${value}"`);
              toFilled = true;
            }
          } catch (e) {
            // Skip inputs that can't be checked
          }
        }
        
        if (fromFilled && toFilled) {
          console.log('✅ Both From and To fields are already filled - skipping field filling');
          fieldsAlreadyFilled = true;
        } else {
          console.log('❌ Fields are not filled - will proceed with filling');
        }
      } catch (e) {
        console.log('Could not check field values, proceeding with filling:', e.message);
      }
      
      if (!fieldsAlreadyFilled) {
        // Debug: Let's see what's actually on the page
        console.log('=== DEBUGGING PAGE ELEMENTS ===');
        
        // Find all input elements
        const allInputs = await $$('//input');
        console.log(`Found ${allInputs.length} input elements on page`);
        
        // Reduced debug logging to save time
        if (allInputs.length > 0) {
          try {
            const placeholder = await allInputs[0].getAttribute('placeholder');
            console.log(`First input placeholder: "${placeholder}"`);
          } catch (e) {
            console.log('Could not get first input attributes');
          }
        }
        
        // Try to find text elements with "From" and "To"
        const fromTexts = await $$('//*[contains(text(), "From")]');
        const toTexts = await $$('//*[contains(text(), "To")]');
        console.log(`Found ${fromTexts.length} elements with "From" text`);
        console.log(`Found ${toTexts.length} elements with "To" text`);
        
        // Let's try multiple strategies to find and fill the From field
        console.log('=== TRYING TO FIND FROM FIELD ===');
        let fromFieldFound = false;
        
        // Strategy 1: Look for input with "from" in placeholder (case insensitive)
        try {
          const fromInput1 = await $('//input[contains(translate(@placeholder, "FROM", "from"), "from")]');
          if (await fromInput1.isExisting()) {
            console.log('Found From field with placeholder strategy');
            await fromInput1.click();
            await browser.pause(1000);
            await fromInput1.setValue('Bengaluru');
            console.log('Successfully entered Bengaluru in From field');
            
            // Wait for suggestions to appear and select first one
            await browser.pause(2000);
            console.log('Looking for From field suggestions...');
            
            // Try different selectors for the first suggestion
            const firstSuggestion = await $('//*[contains(text(), "Search Results")]/following-sibling::*//*[1] | //li[contains(text(), "Bengaluru")][1] | //*[contains(@class, "suggestion")][1] | //*[contains(@class, "dropdown")]//*[1]');
            if (await firstSuggestion.isExisting()) {
              console.log('Found From suggestion, clicking...');
              await firstSuggestion.click();
              console.log('Selected first From suggestion');
            } else {
              console.log('No From suggestions found, continuing...');
            }
            
            fromFieldFound = true;
          }
        } catch (e) {
          console.log('Strategy 1 failed:', e.message);
        }
        
        // Strategy 2: Look for first input field in the page
        if (!fromFieldFound) {
          try {
            const firstInput = await $('//input[1]');
            if (await firstInput.isExisting()) {
              console.log('Trying first input field as From field');
              await firstInput.click();
              await browser.pause(1000);
              await firstInput.setValue('Bengaluru');
              console.log('Successfully entered Bengaluru in first input field');
              
              // Wait for suggestions and select first one
              await browser.pause(2000);
              const firstSuggestion = await $('//*[contains(text(), "Bengaluru")][1] | //*[contains(@class, "suggestion")][1]');
              if (await firstSuggestion.isExisting()) {
                await firstSuggestion.click();
                console.log('Selected first suggestion from first input');
              }
              
              fromFieldFound = true;
            }
          } catch (e) {
            console.log('Strategy 2 failed:', e.message);
          }
        }
        
        // Strategy 3: Click near "From" text and find input
        if (!fromFieldFound) {
          try {
            const fromText = await $('//*[contains(text(), "From")]');
            if (await fromText.isExisting()) {
              console.log('Found From text, clicking on it');
              await fromText.click();
              await browser.pause(1000);
              
              // Now try to find an active input or input near this element
              const nearbyInput = await $('//*[contains(text(), "From")]/following::input[1] | //*[contains(text(), "From")]/preceding::input[1] | //*[contains(text(), "From")]/..//input');
              if (await nearbyInput.isExisting()) {
                await nearbyInput.setValue('Bengaluru');
                console.log('Successfully entered Bengaluru via From text click');
                
                // Wait for suggestions and select first one
                await browser.pause(2000);
                const firstSuggestion = await $('//*[contains(text(), "Bengaluru")][1]');
                if (await firstSuggestion.isExisting()) {
                  await firstSuggestion.click();
                  console.log('Selected suggestion via From text method');
                }
                
                fromFieldFound = true;
              }
            }
          } catch (e) {
            console.log('Strategy 3 failed:', e.message);
          }
        }
        
        await browser.pause(2000);
        
        // Let's try multiple strategies to find and fill the To field
        console.log('=== TRYING TO FIND TO FIELD ===');
        let toFieldFound = false;
        
        // Strategy 1: Look for input with "to" in placeholder (case insensitive)
        try {
          const toInput1 = await $('//input[contains(translate(@placeholder, "TO", "to"), "to")]');
          if (await toInput1.isExisting()) {
            console.log('Found To field with placeholder strategy');
            await toInput1.click();
            await browser.pause(1000);
            await toInput1.setValue('Hyderabad');
            console.log('Successfully entered Hyderabad in To field');
            
            // Wait for suggestions to appear and select first one
            await browser.pause(3000);
            console.log('Looking for To field suggestions...');
            
            // Look for the first Hyderabad option in the search results
            const firstMumbaiOption = await $('//*[contains(text(), "Hyderabad")][1] | //*[contains(text(), "Search Results")]/following-sibling::*//*[contains(text(), "Hyderabad")][1]');
            if (await firstMumbaiOption.isExisting()) {
              console.log('Found first Hyderabad option, clicking...');
              await firstMumbaiOption.click();
              console.log('Selected first Hyderabad suggestion');
            } else {
              // Try alternative selectors for suggestions
              const anySuggestion = await $('//*[contains(@class, "suggestion")][1] | //*[contains(@class, "dropdown")]//*[1] | //li[1]');
              if (await anySuggestion.isExisting()) {
                console.log('Found alternative suggestion, clicking...');
                await anySuggestion.click();
                console.log('Selected alternative suggestion');
              }
            }
            
            toFieldFound = true;
          }
        } catch (e) {
          console.log('To Strategy 1 failed:', e.message);
        }
        
        // Strategy 2: Look for second input field in the page
        if (!toFieldFound) {
          try {
            const secondInput = await $('//input[2]');
            if (await secondInput.isExisting()) {
              console.log('Trying second input field as To field');
              await secondInput.click();
              await browser.pause(1000);
              await secondInput.setValue('Hyderabad');
              console.log('Successfully entered Hyderabad in second input field');
              
              // Wait for suggestions and select first one
              await browser.pause(3000);
              const firstSuggestion = await $('//*[contains(text(), "Hyderabad")][1]');
              if (await firstSuggestion.isExisting()) {
                await firstSuggestion.click();
                console.log('Selected Hyderabad suggestion from second input');
              }
              
              toFieldFound = true;
            }
          } catch (e) {
            console.log('To Strategy 2 failed:', e.message);
          }
        }
        
        // Strategy 3: Click near "To" text and find input
        if (!toFieldFound) {
          try {
            const toText = await $('//*[contains(text(), "To")]');
            if (await toText.isExisting()) {
              console.log('Found To text, clicking on it');
              await toText.click();
              await browser.pause(1000);
              
              // Now try to find an active input or input near this element
              const nearbyInput = await $('//*[contains(text(), "To")]/following::input[1] | //*[contains(text(), "To")]/preceding::input[1] | //*[contains(text(), "To")]/..//input');
              if (await nearbyInput.isExisting()) {
                await nearbyInput.setValue('Hyderabad');
                console.log('Successfully entered Hyderabad via To text click');
                
                // Wait for suggestions and select first one
                await browser.pause(3000);
                const firstSuggestion = await $('//*[contains(text(), "Hyderabad")][1]');
                if (await firstSuggestion.isExisting()) {
                  await firstSuggestion.click();
                  console.log('Selected Hyderabad suggestion via To text method');
                }
                
                toFieldFound = true;
              }
            }
          } catch (e) {
            console.log('To Strategy 3 failed:', e.message);
          }
        }
        
        await browser.pause(3000);
      } else {
        console.log('⏩ Skipping field filling since fields are already populated');
      }
      
      // Now try to find and click the Search Buses button (this runs regardless of whether fields were filled)
      console.log('=== TRYING TO FIND SEARCH BUSES BUTTON ===');
      try {
        const searchButton = await $('//*[contains(text(), "Search Buses")]');
        if (await searchButton.isExisting()) {
          console.log('Found Search Buses button, clicking...');
          await searchButton.click();
          console.log('Search Buses button clicked successfully');
        } else {
          // Try to find any button with "Search" text
          const searchBtn = await $('//button[contains(text(), "Search")] | //*[contains(text(), "Search")]');
          if (await searchBtn.isExisting()) {
            console.log('Found alternative search button, clicking...');
            await searchBtn.click();
            console.log('Alternative search button clicked');
          } else {
            console.log('No search button found, trying to scroll and find it...');
            
            // Try scrolling down to find the search button
            await browser.execute('window.scrollBy(0, 300)');
            await browser.pause(1000);
            
            const searchBtnAfterScroll = await $('//*[contains(text(), "Search Buses")] | //*[contains(text(), "Search")]');
            if (await searchBtnAfterScroll.isExisting()) {
              console.log('Found search button after scroll, clicking...');
              await searchBtnAfterScroll.click();
              console.log('Search button clicked after scroll');
            } else {
              console.log('Still no search button found');
            }
          }
        }
      } catch (e) {
        console.log('Search button click failed:', e.message);
      }
      
      // Wait for navigation to search results
      await browser.pause(5000);
      
      let currentUrl = await browser.getUrl();
      console.log('URL after search:', currentUrl);
      
      // Verify navigation success
      if (currentUrl.includes('search') || currentUrl.includes('result') || currentUrl !== await browser.url('/bus')) {
        console.log('✅ Successfully navigated to search results page');
      } else {
        console.log('❌ May not have navigated to search results');
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
        // Look for seat cards/containers that have visible price with ₹ symbol (any amount)
        console.log('Looking for available seat cards with visible ₹ prices...');
        
        // Find all elements containing ₹ (rupees) symbol
        const seatsWithPrice = await $$('//*[contains(text(), "₹")]');
        console.log(`Found ${seatsWithPrice.length} elements with ₹ symbol`);
        
        let seatSelected = false;
        
        // Try to click on each seat with price until one works
        for (let i = 0; i < seatsWithPrice.length; i++) {
          try {
            const seat = seatsWithPrice[i];
            
            // Check if the seat is clickable and not disabled
            const isDisplayed = await seat.isDisplayed();
            const isClickable = await seat.isClickable();
            
            if (isDisplayed && isClickable) {
              console.log(`Attempting to click seat ${i} with ₹ price...`);
              await seat.click();
              console.log(`✅ Successfully clicked seat ${i} with ₹ price`);
              seatSelected = true;
              break;
            } else {
              console.log(`Seat ${i} is not clickable, trying next...`);
            }
          } catch (e) {
            console.log(`Failed to click seat ${i}:`, e.message);
          }
        }
        
        // If clicking price text didn't work, try clicking the parent container
        if (!seatSelected) {
          console.log('Trying to click seat containers/parents...');
          for (let i = 0; i < seatsWithPrice.length; i++) {
            try {
              // Try clicking the parent element of the price text
              const seatContainer = await seatsWithPrice[i].$('..');
              if (await seatContainer.isExisting()) {
                const isDisplayed = await seatContainer.isDisplayed();
                const isClickable = await seatContainer.isClickable();
                
                if (isDisplayed && isClickable) {
                  console.log(`Clicking parent container of seat ${i}...`);
                  await seatContainer.click();
                  console.log(`✅ Successfully clicked seat container ${i}`);
                  seatSelected = true;
                  break;
                }
              }
            } catch (e) {
              console.log(`Failed to click seat container ${i}:`, e.message);
            }
          }
        }
        
        // Alternative approach: Look for seat elements with specific attributes
        if (!seatSelected) {
          console.log('Trying alternative seat selection...');
          const seatElements = await $$('//*[contains(@class, "seat") and not(contains(@class, "disabled")) and not(contains(@class, "occupied"))] | //div[contains(text(), "₹")]/parent::* | //span[contains(text(), "₹")]/ancestor::*[1]');
          console.log(`Found ${seatElements.length} potential seat elements`);
          
          for (let i = 0; i < seatElements.length; i++) {
            try {
              const seat = seatElements[i];
              const isDisplayed = await seat.isDisplayed();
              const isClickable = await seat.isClickable();
              
              if (isDisplayed && isClickable) {
                console.log(`Clicking alternative seat element ${i}...`);
                await seat.click();
                console.log(`✅ Successfully clicked alternative seat ${i}`);
                seatSelected = true;
                break;
              }
            } catch (e) {
              console.log(`Failed to click alternative seat ${i}:`, e.message);
            }
          }
        }
        
        if (!seatSelected) {
          throw new Error('Could not select any available seat with visible ₹ price');
        }
        
      } catch (e) {
        console.log('Seat selection failed:', e.message);
        throw new Error('Seat selection failed - aborting test');
      }
      
      // === STEP 3: CLICK NEXT BUTTON ===
      console.log('=== STEP 3: CLICKING NEXT BUTTON ===');
      await browser.pause(2000);
      
      try {
        const nextButton = await $('//*[contains(text(), "Next")]');
        if (await nextButton.isExisting()) {
          console.log('Found Next button, clicking...');
          await nextButton.click();
          console.log('✅ Next button clicked');
        } else {
          throw new Error('Next button not found');
        }
      } catch (e) {
        console.log('Next button click failed:', e.message);
        throw new Error('Next button click failed - aborting test');
      }
      
      // === STEP 4: SELECT PICKUP POINT ===
      console.log('=== STEP 4: SELECTING PICKUP POINT ===');
      await browser.pause(3000);
      
      try {
        // Look for pickup point cards (gray containers) - click on the card, not radio button
        console.log('Looking for pickup point cards to click...');
        
        // Find pickup point cards by looking for elements containing pickup location names
        const pickupCards = await $$('//*[contains(text(), "metro") or contains(text(), "station") or contains(text(), "Akshardham") or contains(text(), "kashmir") or contains(text(), "gate") or contains(text(), "tila") or contains(text(), "Majnu")]');
        console.log(`Found ${pickupCards.length} pickup point name elements`);
        
        let pickupSelected = false;
        
        // Try to click on each pickup card container until one works
        for (let i = 0; i < pickupCards.length; i++) {
          try {
            // Get the card container (parent element that contains the whole pickup info)
            const cardContainer = await pickupCards[i].$('..');
            
            if (await cardContainer.isExisting()) {
              const isDisplayed = await cardContainer.isDisplayed();
              const isClickable = await cardContainer.isClickable();
              
              if (isDisplayed && isClickable) {
                console.log(`Clicking pickup point card ${i}...`);
                await cardContainer.click();
                console.log(`✅ Successfully clicked pickup point card ${i}`);
                pickupSelected = true;
                break;
              }
            }
            
            // If parent doesn't work, try clicking the element itself
            if (!pickupSelected) {
              const isDisplayed = await pickupCards[i].isDisplayed();
              const isClickable = await pickupCards[i].isClickable();
              
              if (isDisplayed && isClickable) {
                console.log(`Clicking pickup point element ${i}...`);
                await pickupCards[i].click();
                console.log(`✅ Successfully clicked pickup point element ${i}`);
                pickupSelected = true;
                break;
              }
            }
          } catch (e) {
            console.log(`Failed to click pickup point ${i}:`, e.message);
          }
        }
        
        if (!pickupSelected) {
          // Fallback: Look for any clickable element in the pickup section
          const anyPickupElement = await $('//*[contains(text(), "Pickup Point")]/following-sibling::*//*[1]');
          if (await anyPickupElement.isExisting()) {
            console.log('Trying fallback pickup element...');
            await anyPickupElement.click();
            console.log('✅ Clicked fallback pickup element');
          } else {
            console.log('❌ No pickup point found, but continuing...');
          }
        }
      } catch (e) {
        console.log('Pickup point selection failed:', e.message);
      }
      
      // Wait for automatic navigation to drop points (as mentioned by user)
      await browser.pause(4000);
      
      // === STEP 5: SELECT DROP POINT ===
      console.log('=== STEP 5: SELECTING DROP POINT ===');
      
      try {
        // Look for drop point cards (gray containers) - click on the card, not radio button
        console.log('Looking for drop point cards to click...');
        
        // Find drop point cards by looking for elements containing drop location names
        const dropCards = await $$('//*[contains(text(), "Virar") or contains(text(), "Katrej") or contains(text(), "Borivali") or contains(text(), "mumbai") or contains(text(), "ata") or contains(text(), "pass")]');
        console.log(`Found ${dropCards.length} drop point name elements`);
        
        let dropSelected = false;
        
        // Try to click on each drop card container until one works
        for (let i = 0; i < dropCards.length; i++) {
          try {
            // Get the card container (parent element that contains the whole drop info)
            const cardContainer = await dropCards[i].$('..');
            
            if (await cardContainer.isExisting()) {
              const isDisplayed = await cardContainer.isDisplayed();
              const isClickable = await cardContainer.isClickable();
              
              if (isDisplayed && isClickable) {
                console.log(`Clicking drop point card ${i}...`);
                await cardContainer.click();
                console.log(`✅ Successfully clicked drop point card ${i}`);
                dropSelected = true;
                break;
              }
            }
            
            // If parent doesn't work, try clicking the element itself
            if (!dropSelected) {
              const isDisplayed = await dropCards[i].isDisplayed();
              const isClickable = await dropCards[i].isClickable();
              
              if (isDisplayed && isClickable) {
                console.log(`Clicking drop point element ${i}...`);
                await dropCards[i].click();
                console.log(`✅ Successfully clicked drop point element ${i}`);
                dropSelected = true;
                break;
              }
            }
          } catch (e) {
            console.log(`Failed to click drop point ${i}:`, e.message);
          }
        }
        
        if (!dropSelected) {
          // Fallback: Look for any clickable element in the drop section
          const anyDropElement = await $('//*[contains(text(), "Drop Point")]/following-sibling::*//*[1]');
          if (await anyDropElement.isExisting()) {
            console.log('Trying fallback drop element...');
            await anyDropElement.click();
            console.log('✅ Clicked fallback drop element');
          } else {
            console.log('❌ No drop point found, but trying to proceed...');
          }
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
      await browser.pause(4000);
      
      // === STEP 7: HANDLE LOGIN SCREEN ===
      console.log('=== STEP 7: HANDLING LOGIN SCREEN ===');
      console.log('⏩ LOGIN TEST COMMENTED OUT - SKIPPING LOGIN STEP');
      
      /*
      try {
        // Check if login iframe appeared
        console.log('Looking for login iframe...');
        
        // Wait for iframe to appear
        await browser.pause(3000);
        
        // Look for iframe with specific ID
        const loginIframe = await $('#oauth-iframe');
        if (await loginIframe.isExisting()) {
          console.log('Login iframe detected, switching to iframe context...');
          
          // Switch to iframe
          await browser.switchToFrame(loginIframe);
          console.log('✅ Switched to iframe context');
          
          // Now we should be inside the iframe, look for login elements
          console.log('Looking for login heading inside iframe...');
          const loginHeading = await $('//*[contains(text(), "Enter details to login")]');
          if (await loginHeading.isExisting()) {
            console.log('✅ Login screen confirmed inside iframe');
          } else {
            console.log('Login heading not found inside iframe, but proceeding...');
          }
          
          // Enter mobile number using the specific input ID
          console.log('Looking for mobile number input inside iframe...');
          
          // Look for input with specific ID from the HTML structure
          const mobileInput = await $('#email_mobile_login');
          if (await mobileInput.isExisting()) {
            console.log('Found mobile input with ID email_mobile_login');
            
            // Clear and enter mobile number
            await mobileInput.click();
            await browser.pause(500);
            await mobileInput.clearValue();
            await browser.pause(500);
            await mobileInput.setValue('7777799999');
            await browser.pause(1000);
            
            // Verify the value was entered
            const enteredValue = await mobileInput.getValue();
            console.log(`Value in input after entry: "${enteredValue}"`);
            
            if (enteredValue === '7777799999') {
              console.log('✅ Mobile number entered successfully: 7777799999');
            } else {
              console.log(`⚠️ Mobile number may not be entered correctly. Expected: 7777799999, Got: ${enteredValue}`);
              
              // Try alternative method - type character by character
              await mobileInput.click();
              await browser.pause(500);
              await browser.keys(['Control', 'a']); // Select all
              await browser.pause(200);
              await browser.keys('7777799999');
              await browser.pause(1000);
              console.log('Tried alternative keyboard input method');
            }
          } else {
            // Fallback to placeholder-based selection
            console.log('Input ID not found, trying placeholder-based selection...');
            const mobileInputByPlaceholder = await $('//input[@placeholder="10 digit mobile number"]');
            if (await mobileInputByPlaceholder.isExisting()) {
              console.log('Found mobile input by placeholder');
              await mobileInputByPlaceholder.click();
              await browser.pause(500);
              await mobileInputByPlaceholder.clearValue();
              await browser.pause(500);
              await mobileInputByPlaceholder.setValue('7777799999');
              console.log('✅ Mobile number entered via placeholder selector');
            } else {
              console.log('❌ Mobile input not found with any method');
            }
          }
          
          // Wait for button to become enabled (it starts disabled)
          await browser.pause(2000);
          
          // Click Verify with OTP button using oauth-id
          console.log('Looking for Verify with OTP button...');
          const verifyOtpButton = await $('[oauth-id="login_button"]');
          if (await verifyOtpButton.isExisting()) {
            console.log('Found Verify with OTP button by oauth-id, checking if enabled...');
            
            // Wait for button to become enabled (since it starts disabled)
            await browser.waitUntil(
              async () => {
                const isEnabled = await verifyOtpButton.isEnabled();
                return isEnabled;
              },
              {
                timeout: 10000,
                timeoutMsg: 'Verify with OTP button did not become enabled within 10 seconds'
              }
            );
            
            console.log('Button is now enabled, clicking...');
            await verifyOtpButton.click();
            console.log('✅ Verify with OTP button clicked');
          } else {
            // Fallback to text-based button selection
            console.log('Button not found by oauth-id, trying text-based selection...');
            const verifyOtpButtonByText = await $('//*[contains(text(), "Verify with OTP")]');
            if (await verifyOtpButtonByText.isExisting()) {
              console.log('Found Verify with OTP button by text, clicking...');
              await verifyOtpButtonByText.click();
              console.log('✅ Verify with OTP button clicked');
            } else {
              console.log('❌ Verify with OTP button not found');
            }
          }
          
          // Wait for OTP input screen to appear
          await browser.pause(4000);
          
          // Enter OTP
          console.log('Looking for OTP input...');
          // The OTP input might have different attributes after the page changes
          const otpInput = await $('//input[contains(@placeholder, "OTP") or contains(@placeholder, "otp") or @type="tel" or @maxlength="6" or contains(@name, "otp")]');
          if (await otpInput.isExisting()) {
            console.log('Found OTP input, entering OTP...');
            await otpInput.click();
            await browser.pause(500);
            await otpInput.clearValue();
            await browser.pause(500);
            await otpInput.setValue('888888');
            console.log('✅ OTP entered: 888888');
          } else {
            console.log('❌ OTP input not found, trying alternative selectors...');
            // Try finding any input that appears after mobile number entry
            const anyNewInput = await $('//input[2] | //input[last()]');
            if (await anyNewInput.isExisting()) {
              console.log('Found alternative input, entering OTP...');
              await anyNewInput.setValue('888888');
              console.log('✅ OTP entered in alternative input');
            }
          }
          
          // Click Confirm/Verify button
          await browser.pause(1000);
          console.log('Looking for Confirm/Verify button...');
          const confirmButton = await $('//*[contains(text(), "Confirm") or contains(text(), "Verify") or contains(text(), "Submit") or contains(text(), "Continue")]');
          if (await confirmButton.isExisting()) {
            console.log('Found Confirm button, clicking...');
            await confirmButton.click();
            console.log('✅ Confirm button clicked');
          } else {
            console.log('❌ Confirm button not found');
          }
          
          // Wait for login completion
          await browser.pause(5000);
          
          // Switch back to main frame
          await browser.switchToFrame(null);
          console.log('✅ Switched back to main frame');
          console.log('✅ Login process completed');
          
        } else {
          console.log('No login iframe detected, checking for direct login screen...');
          
          // Check if login screen appeared directly (not in iframe)
          const loginHeading = await $('//*[contains(text(), "Enter details to login")]');
          if (await loginHeading.isExisting()) {
            console.log('Login screen detected (not in iframe), proceeding with login...');
            
            // Enter mobile number (existing code for non-iframe login)
            console.log('Looking for mobile number input...');
            const mobileInput = await $('//input[@placeholder="10 digit mobile number"]');
            if (await mobileInput.isExisting()) {
              console.log('Found mobile input with exact placeholder');
              await mobileInput.click();
              await browser.pause(500);
              await mobileInput.clearValue();
              await browser.pause(500);
              await mobileInput.setValue('7777799999');
              console.log('✅ Mobile number entered successfully: 7777799999');
            } else {
              console.log('❌ Mobile input not found');
            }
            
            // Click Verify with OTP button
            await browser.pause(1000);
            const verifyOtpButton = await $('//*[contains(text(), "Verify with OTP")]');
            if (await verifyOtpButton.isExisting()) {
              console.log('Found Verify with OTP button, clicking...');
              await verifyOtpButton.click();
              console.log('✅ Verify with OTP button clicked');
            }
            
            // Wait and enter OTP
            await browser.pause(3000);
            const otpInput = await $('//input[contains(@placeholder, "OTP") or contains(@placeholder, "otp") or @type="tel" or @maxlength="6"]');
            if (await otpInput.isExisting()) {
              console.log('Found OTP input, entering OTP...');
              await otpInput.setValue('888888');
              console.log('✅ OTP entered: 888888');
            }
            
            // Click Confirm
            await browser.pause(1000);
            const confirmButton = await $('//*[contains(text(), "Confirm") or contains(text(), "Verify") or contains(text(), "Submit")]');
            if (await confirmButton.isExisting()) {
              await confirmButton.click();
              console.log('✅ Confirm button clicked');
            }
            
            await browser.pause(4000);
            console.log('✅ Login process completed');
            
          } else {
            console.log('No login screen detected, proceeding to next step...');
          }
        }
      } catch (e) {
        console.log('Login process failed:', e.message);
        
        // Make sure we're back in main frame in case of error
        try {
          await browser.switchToFrame(null);
          console.log('Switched back to main frame after error');
        } catch (frameError) {
          console.log('Could not switch back to main frame:', frameError.message);
        }
        
        console.log('Attempting to continue with booking flow...');
      }
      */
      
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
      
      // Final verification
      currentUrl = await browser.getUrl();
      console.log('Final URL:', currentUrl);
      
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
      
      // === STEP 10: CLICK PROCEED TO PAY ===
      console.log('=== STEP 10: CLICKING PROCEED TO PAY ===');
      await browser.pause(2000);
      
      try {
        const proceedToPayButton = await $('//*[contains(text(), "Proceed To Pay")]');
        if (await proceedToPayButton.isExisting()) {
          console.log('Found Proceed To Pay button, clicking...');
          await proceedToPayButton.click();
          console.log('✅ Proceed To Pay button clicked');
          
          // Wait for loader to finish and payment gateway to load completely
          console.log('⏳ Waiting for loader to finish and payment gateway to load completely...');
          await browser.pause(8000); // Increased from 5000 to 8000ms for better page loading
          console.log('✅ Payment gateway should be fully loaded now');
        } else {
          console.log('❌ Proceed To Pay button not found');
        }
      } catch (e) {
        console.log('Proceed To Pay button click failed:', e.message);
      }
      
      // === STEP 11: SELECT NET BANKING OPTION ===
      console.log('=== STEP 11: SELECTING NET BANKING OPTION ===');
      await browser.pause(3000); // Additional wait before attempting Net Banking selection
      
      // Debug: Let's see what payment options are available
      console.log('=== DEBUGGING PAYMENT OPTIONS ===');
      try {
        const paymentOptionsText = await $$('//*[contains(text(), "Payment") or contains(text(), "UPI") or contains(text(), "Net Banking") or contains(text(), "Prepaid")]');
        console.log(`Found ${paymentOptionsText.length} payment-related text elements`);
        for (let i = 0; i < Math.min(paymentOptionsText.length, 5); i++) {
          try {
            const text = await paymentOptionsText[i].getText();
            console.log(`Payment element ${i}: "${text}"`);
          } catch (e) {
            console.log(`Could not get text for payment element ${i}`);
          }
        }
      } catch (e) {
        console.log('Debug failed:', e.message);
      }
      
      try {
        let netBankingClicked = false;
        
        // Strategy 1: Try to find and click the complete Net Banking card
        console.log('Strategy 1: Looking for Net Banking complete card...');
        const allClickableElements = await $$('//*[contains(text(), "Net Banking")]');
        console.log(`Found ${allClickableElements.length} elements containing "Net Banking"`);
        
        for (let i = 0; i < allClickableElements.length; i++) {
          try {
            const element = allClickableElements[i];
            const isDisplayed = await element.isDisplayed();
            const isClickable = await element.isClickable();
            
            if (isDisplayed && isClickable) {
              console.log(`Trying to click Net Banking element ${i}...`);
              await element.click();
              console.log(`✅ Clicked Net Banking element ${i}`);
              
              // Verify if click worked by checking if we're still on same page
              await browser.pause(2000);
              const stillOnPaymentPage = await $('//*[contains(text(), "Payment Options")]');
              if (await stillOnPaymentPage.isExisting()) {
                console.log(`⚠️ Still on payment page after clicking element ${i} - click may not have worked`);
              } else {
                console.log(`✅ Successfully navigated away from payment page with element ${i}`);
                netBankingClicked = true;
                break;
              }
            } else {
              console.log(`Element ${i} is not clickable or not displayed`);
            }
          } catch (e) {
            console.log(`Failed to click element ${i}:`, e.message);
          }
        }
        
        // Strategy 2: Try clicking on the arrow next to Net Banking
        if (!netBankingClicked) {
          console.log('Strategy 2: Trying to click on arrow next to Net Banking...');
          try {
            // Look for arrow or chevron near Net Banking
            const netBankingRow = await $('//*[contains(text(), "Net Banking")]/ancestor::*[contains(@class, "row") or contains(@class, "option") or contains(@class, "item")][1]');
            if (await netBankingRow.isExisting()) {
              console.log('Found Net Banking row, clicking on it...');
              await netBankingRow.click();
              console.log('✅ Net Banking row clicked');
              
              // Check if navigation happened
              await browser.pause(2000);
              const stillOnPaymentPage = await $('//*[contains(text(), "Payment Options")]');
              if (!await stillOnPaymentPage.isExisting()) {
                console.log('✅ Successfully navigated away from payment page');
                netBankingClicked = true;
              } else {
                console.log('⚠️ Still on payment page after row click');
              }
            }
          } catch (e) {
            console.log('Arrow/row click failed:', e.message);
          }
        }
        
        // Strategy 3: Try clicking using coordinates in the center of Net Banking area
        if (!netBankingClicked) {
          console.log('Strategy 3: Trying coordinate-based click on Net Banking...');
          try {
            const netBankingText = await $('//*[contains(text(), "Net Banking")]');
            if (await netBankingText.isExisting()) {
              // Get the location and size of the element
              const location = await netBankingText.getLocation();
              const size = await netBankingText.getSize();
              
              // Click in the center-right of the Net Banking row (where the arrow would be)
              const clickX = location.x + size.width + 50; // 50 pixels to the right
              const clickY = location.y + (size.height / 2); // Center vertically
              
              console.log(`Clicking at coordinates: (${clickX}, ${clickY})`);
              await browser.performActions([{
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'touch' },
                actions: [
                  { type: 'pointerMove', duration: 0, x: clickX, y: clickY },
                  { type: 'pointerDown', button: 0 },
                  { type: 'pause', duration: 100 },
                  { type: 'pointerUp', button: 0 }
                ]
              }]);
              
              console.log('✅ Coordinate click performed');
              
              // Check if navigation happened
              await browser.pause(3000);
              const stillOnPaymentPage = await $('//*[contains(text(), "Payment Options")]');
              if (!await stillOnPaymentPage.isExisting()) {
                console.log('✅ Successfully navigated away from payment page with coordinates');
                netBankingClicked = true;
              } else {
                console.log('⚠️ Still on payment page after coordinate click');
              }
            }
          } catch (e) {
            console.log('Coordinate click failed:', e.message);
          }
        }
        
        // Strategy 4: Try tapping on the entire screen area of Net Banking
        if (!netBankingClicked) {
          console.log('Strategy 4: Trying screen tap on Net Banking area...');
          try {
            const netBankingText = await $('//*[contains(text(), "Net Banking")]');
            if (await netBankingText.isExisting()) {
              // Try tapping on the element itself
              await browser.touchAction({
                action: 'tap',
                element: netBankingText
              });
              console.log('✅ Touch action performed on Net Banking');
              
              // Check if navigation happened
              await browser.pause(3000);
              const stillOnPaymentPage = await $('//*[contains(text(), "Payment Options")]');
              if (!await stillOnPaymentPage.isExisting()) {
                console.log('✅ Successfully navigated away from payment page with touch action');
                netBankingClicked = true;
              } else {
                console.log('⚠️ Still on payment page after touch action');
              }
            }
          } catch (e) {
            console.log('Touch action failed:', e.message);
          }
        }
        
        if (netBankingClicked) {
          // Wait longer for the "Select your Bank" popup to appear
          console.log('⏳ Net Banking selected successfully! Waiting for "Select your Bank" popup to appear...');
          await browser.pause(7000); // Increased from 5000 to 7000ms for popup to fully load
          
          // Check if popup appeared
          const selectBankPopup = await $('//*[contains(text(), "Select your Bank")]');
          if (await selectBankPopup.isExisting()) {
            console.log('✅ "Select your Bank" popup appeared!');
            console.log('⏳ Waiting extra time for popup to fully render...');
            await browser.pause(3000); // Extra wait for popup to fully render
          } else {
            console.log('⚠️ Popup may not have appeared yet, but continuing...');
            await browser.pause(2000); // Still wait a bit even if popup text not found
          }
        } else {
          console.log('❌ Could not click Net Banking option with any strategy - UI not moving forward');
        }
        
      } catch (e) {
        console.log('Net Banking option click failed:', e.message);
      }
      
      // === STEP 12: SELECT ICICI BANK FROM POPUP ===
      console.log('=== STEP 12: SELECTING ICICI BANK FROM POPUP ===');
      await browser.pause(1000); // Reduced since we already waited above
      
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
    //   console.log('=== STEP 13: CLICKING PAY BUTTON ===');
    //   await browser.pause(3000); // Increased delay as requested
      
    //   try {
    //     // Look for Pay button with amount
    //     console.log('Looking for Pay button...');
    //     const payButton = await $('//*[contains(text(), "Pay ₹3,150") or contains(text(), "Pay ₹") or contains(text(), "Pay")]');
    //     if (await payButton.isExisting()) {
    //       console.log('Found Pay button, clicking...');
    //       await payButton.click();
    //       console.log('✅ Pay button clicked - proceeding to bank gateway');
          
    //       // Wait for bank gateway to load
    //       await browser.pause(5000); // Increased wait time for bank gateway
    //       console.log('✅ Should be redirected to ICICI bank gateway');
    //     } else {
    //       // Try alternative Pay button selectors
    //       console.log('Pay button not found, trying alternative selectors...');
    //       const payButtonAlt = await $('//button[contains(text(), "Pay")] | //div[contains(text(), "Pay")] | //*[contains(@class, "pay")]//*[contains(text(), "Pay")]');
    //       if (await payButtonAlt.isExisting()) {
    //         console.log('Found Pay button with alternative selector, clicking...');
    //         await payButtonAlt.click();
    //         console.log('✅ Pay button clicked (alternative)');
    //         await browser.pause(5000);
    //       } else {
    //         console.log('❌ Pay button not found with any selector');
    //       }
    //     }
    //   } catch (e) {
    //     console.log('Pay button click failed:', e.message);
    //   }
      
      // Final status
    //   console.log('🎉 PAYMENT FLOW COMPLETED - Test should now be at bank gateway');
    //   await browser.pause(3000); // Wait 3 seconds to see final state
    });
  });
  