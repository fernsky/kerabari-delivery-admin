INSERT INTO
    public.acme_users (
        id,
        user_name,
        "name",
        hashed_password,
        phone_number,
        email,
        avatar,
        ward_number,
        "role",
        is_active,
        created_at,
        updated_at
    )
VALUES
    (
        'sx9kfrgnnxjabu3wp4mbu',
        'admin',
        'Suresh Sahu',
        'a86b1dbc9dc5187f404c5bc2032346b0:2d2ae70b65913284d72b78572f3049f0e2504d81a9b278855cbdf8f67e23966d3273fdcc9e9f8314b49a01761486638609e24cb0d430cd6c264a626c98464fe3',
        '9843016335',
        'ito.khajuramun@gmail.com',
        NULL,
        1,
        'superadmin'::public."roles",
        true,
        '2025-01-21 11:31:27.615',
        '2025-01-21 11:31:27.615'
    );