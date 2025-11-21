
const BASE_URL = 'http://localhost:4000';

async function run() {
  try {
    console.log('--- STARTING DEEPSEA SCENARIO TEST ---');

    // 1. Login as Admin (f / f)
    console.log('\n[1] Logging in as initial Admin (email: f, password: f)...');
    const adminRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'f', password: 'f' })
    });
    
    if (!adminRes.ok) {
        const text = await adminRes.text();
        throw new Error(`Admin login failed: ${adminRes.status} ${text}`);
    }
    const adminData = await adminRes.json();
    const adminToken = adminData.token;
    if (!adminToken) throw new Error('No token received for admin');
    console.log('✅ Admin logged in.');

    // 2. Create Species
    console.log('\n[2] Creating 3 species...');
    const speciesIds = [];
    for (let i = 1; i <= 3; i++) {
      const uniqueNum = Date.now() + i;
      const res = await fetch(`${BASE_URL}/species`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name: `Species ${i}-${uniqueNum}`,
          description: `Test description for species ${i}`,
          rarityScore: i * 10
        })
      });
      if (!res.ok) {
          console.error(`❌ Failed to create species ${i}:`, await res.text());
      } else {
        const data = await res.json();
        // API response might differ, check "data" property if wrapped
        const id = data.id || (data.data && data.data.id) || data.id;
        if (id) {
            speciesIds.push(id);
            console.log(`✅ Species ${i} created (ID: ${id})`);
        } else {
            console.log(`✅ Species ${i} created (Unknown ID structure)`, data);
        }
      }
    }

    if (speciesIds.length === 0) throw new Error('No species created, cannot proceed.');

    // 3. Make Observations
    console.log('\n[3] Making observations with Admin account...');
    const observationIds = [];
    for (let i = 0; i < 3; i++) {
        const speciesId = speciesIds[i % speciesIds.length];
        const res = await fetch(`${BASE_URL}/observations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                speciesId: Number(speciesId),
                imageUrl: `http://example.com/obs${i}.jpg`,
                latitude: 45.0 + i,
                longitude: -1.0 - i,
                depth: 10 + i,
                description: `Observation ${i} by Admin`
            })
        });
        if (!res.ok) {
            console.error(`❌ Failed to create observation ${i}:`, await res.text());
        } else {
            const data = await res.json();
            const id = data.data?.id || data.id;
            if (id) {
                observationIds.push(id);
                console.log(`✅ Observation ${i} created (ID: ${id})`);
            }
        }
    }

    if (observationIds.length === 0) throw new Error('No observations created.');

    // 4. Try to validate by same user (should fail)
    console.log('\n[4] Attempting self-validation (expecting failure)...');
    const obsToValidate = observationIds[0];
    const selfValidateRes = await fetch(`${BASE_URL}/observations/${obsToValidate}/validate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    
    if (selfValidateRes.status === 403 || selfValidateRes.status === 400 || selfValidateRes.status === 409) {
        console.log(`✅ Success: Self-validation refused as expected (Status: ${selfValidateRes.status})`);
        // console.log(await selfValidateRes.json());
    } else {
        console.error(`❌ Failure: Self-validation returned unexpected status ${selfValidateRes.status}`);
        console.error(await selfValidateRes.text());
    }

    // 5. Register/Log new user
    console.log('\n[5] Registering and logging in a NEW user...');
    const timestamp = Date.now();
    const newUsername = `user_${timestamp}`;
    const newEmail = `user_${timestamp}@example.com`;
    const newPassword = 'password123';

    const regRes = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, username: newUsername, password: newPassword })
    });

    let newUserId;
    if (regRes.ok) {
        const data = await regRes.json();
        newUserId = data.id || (data.user && data.user.id);
        console.log('✅ New user registered.');
    } else {
        console.warn('⚠️ Registration issue:', await regRes.text());
    }

    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, password: newPassword })
    });

    if (!loginRes.ok) throw new Error('New user login failed');
    const loginData = await loginRes.json();
    const userToken = loginData.token;
    console.log('✅ New user logged in.');

    if (!newUserId) {
        const meRes = await fetch(`${BASE_URL}/auth/me`, {
             headers: { 'Authorization': `Bearer ${userToken}` }
        });
        if (meRes.ok) {
            const meData = await meRes.json();
            newUserId = meData.id;
        }
    }
    console.log(`New User ID: ${newUserId}`);

    if (!newUserId) throw new Error('Could not determine new user ID');

    // 6. Promote new user to Admin
    console.log('\n[6] Promoting new user to ADMIN (using initial Admin account)...');
    const promoteRes = await fetch(`${BASE_URL}/admin/users/${newUserId}/role`, {
        method: 'PATCH',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}` 
        },
        body: JSON.stringify({ role: 'ADMIN' })
    });

    if (promoteRes.ok) {
        console.log('✅ User promoted to ADMIN.');
    } else {
        console.error('❌ Failed to promote user:', await promoteRes.text());
        // If promotion fails, next step might fail (403)
    }

    // 7. Make Reputation (Validate observation as new admin)
    console.log('\n[7] Making reputation: Validating initial observation as the NEW Admin...');
    // This should work because the validator (new admin) is different from the author (old admin)
    const validateRes = await fetch(`${BASE_URL}/observations/${obsToValidate}/validate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${userToken}` }
    });

    if (validateRes.ok) {
        const valData = await validateRes.json();
        console.log('✅ Observation validated successfully!');
        // console.log(JSON.stringify(valData, null, 2));
    } else {
        console.error('❌ Failed to validate observation:', await validateRes.text());
    }

    console.log('\n--- SCENARIO COMPLETED ---');

  } catch (error) {
    console.error('❌ Scenario failed with error:', error);
  }
}

run();

