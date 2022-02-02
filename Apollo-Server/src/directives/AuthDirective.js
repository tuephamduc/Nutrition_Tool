import { SchemaDirectiveVisitor, AuthenticationError } from "apollo-server-express";
import { defaultFieldResolver } from "graphql"

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const requiredRole = this.args.requires;
    const originalResolve = field.resolve || defaultFieldResolver;
    field.resolve = async function (...args) {

      const context = args[2];
      const user = context.user.user || {};

      const userRoles = user.roles;
      // const isUnauthorized = !userRoles.includes(requiredRole);
      const isUnauthorized = !(userRoles == requiredRole);
      // console.log(userRoles);
      // console.log("requre", requiredRole);
      if (isUnauthorized) {
        throw new AuthenticationError(`You need following role: ${requiredRole}`);
      }
      return originalResolve.apply(this, args);
    }
  }
}


export default AuthDirective;