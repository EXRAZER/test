import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";


export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      // credentials: {
      //   username: {
      //     label: "Email",
      //     type: "text",
      //     placeholder: "example@domain.com",
      //   },
      //   password: {
      //     label: "Password",
      //     type: "password",
      //     placeholder: "************",
      //   },
      // },

      async authorize(credentials, req) {

        // get data from db or api  
        // let level_auth = "/student";
        // if (credentials.level == "teacher") {
        //   level_auth = "/teacher";
        // } else if (credentials.level == "admin") {
        //   level_auth = "/admin";
        // }

        const sendData = { username: credentials.username, password: credentials.password };

        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/user/authn", {
          method: 'POST',
          body: JSON.stringify(sendData),
          headers: { "Content-Type": "application/json" }
        });

        const user = await res.json()

        // console.log(user);
        
        if (user) {

          if (user.error == true) {
            return {
              message: user.message,
              error: user.error,
            };

          } else {
            return {
              message: user.message,
              error: user.error,
              id: user.data.userID_usersProducer,
              role: user.data.role,
              email: user.data.email,
              gender: user.data.gender,
              path2picture: user.data.path2picture,
              number: user.data.number,
              address: user.data.address,
              username: user.data.username
              // role:user.data.role
            };

          }

        }

        // login fail
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {

      // first time jwt call back is run, user object is avalible
      if (user) { 
        // token.role = user.role;
        token.error = user.error;
        token.message = user.message;
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.gender = user.gender;
        token.path2picture = user.path2picture;
        token.number = user.number;
        token.address = user.address;
        token.username = user.username
      }

      return token;

    },
    session: ({ session, token }) => {
      // Send properties to the client, like an access_token and user id from a provider.

      if (token) {
        session.id = token.id;
        session.error = token.error;
        session.message = token.message;
        session.role = token.role;
        session.email = token.email;
        session.gender = token.gender;
        session.path2picture = token.path2picture;
        session.number = token.number;
        session.address = token.address;
        session.username = token.username;
      }

      return session;
    },

  },
  secret: "3caxjLWm0CQvG4Hs4oQXJ8a25zj7NraH/1ZS7MJo8wg=",
  jwt: {
    secrete: "test",
    encryption: true,
  },
  pages: {
    signIn: "/login"
  }

});
