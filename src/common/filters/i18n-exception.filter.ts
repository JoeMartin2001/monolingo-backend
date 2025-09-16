// infra/i18n/i18n-exception.filter.ts
import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { I18nContext, Path } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';

@Catch(HttpException)
export class I18nGqlExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const i18n = I18nContext.current<I18nTranslations>(host);

    if (!i18n) {
      throw new Error('No i18n context found');
    }

    const lang = i18n.lang;

    const res = exception.getResponse() as {
      key?: string;
      message?: string;
      args?: Record<string, any>;
    };

    const key = res?.key ?? res?.message;
    const args = res?.args ?? {};
    const translated =
      typeof key === 'string'
        ? i18n.t(key as Path<I18nTranslations>, { lang, args })
        : undefined;

    console.log(`${key} -> ${JSON.stringify(translated)}`);

    // Rewrap with translated message, keep status & extensions
    return new HttpException(translated ?? res, exception.getStatus());
  }
}
