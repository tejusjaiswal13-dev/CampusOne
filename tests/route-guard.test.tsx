// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { RoleGuard } from '../src/components/common/RoleGuard';
import type { UserRole } from '../src/types';
afterEach(cleanup);
describe('role guard',()=>{
 for(const role of ['STUDENT','FACULTY','DEPARTMENT_ADMIN'] as UserRole[])it(`blocks ${role} from user administration`,()=>{render(<RoleGuard role={role} tab="users"><p>Private users</p></RoleGuard>);expect(screen.getByRole('alert')).toHaveTextContent('Not authorised');expect(screen.queryByText('Private users')).toBeNull();});
 it('allows college administrator',()=>{render(<RoleGuard role="COLLEGE_ADMIN" tab="users"><p>Private users</p></RoleGuard>);expect(screen.getByText('Private users')).toBeInTheDocument();});
 it('blocks a student from faculty classes',()=>{render(<RoleGuard role="STUDENT" tab="classes"><p>Faculty classes</p></RoleGuard>);expect(screen.queryByText('Faculty classes')).toBeNull();});
});
